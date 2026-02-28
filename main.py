
from fastapi import FastAPI, HTTPException,Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
from passlib.context import CryptContext
from jose import jwt,JWTError
from datetime import datetime, timedelta
from database import users_collection
from models import UserRegister, UserLogin
import os
import json
import re
from database import quiz_results_collection
from models import SaveQuizResult
from datetime import datetime

# ===============================
# LOAD ENV
# ===============================
load_dotenv()

GROQ_API_KEY = ""
JWT_SECRET = os.getenv("JWT_SECRET", "supersecretkey")

# ===============================
# APP INIT
# ===============================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=GROQ_API_KEY)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# ===============================
# VERIFY TOKEN FUNCTION
# ===============================
def verify_token(authorization: str = Header(None)):

    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")

    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        email = payload.get("sub")

        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")

        return email

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# ===============================
# REQUEST MODELS
# ===============================
class Question(BaseModel):
    question: str

class RoadmapRequest(BaseModel):
    goal: str
    level: str

class QuizRequest(BaseModel):
    topic: str
    level: str
    num_questions: int




# ===============================
# CHAT ROUTE
# ===============================
@app.post("/chat")
async def chat(data: Question):
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "You are a biotechnology tutor. Tell the information within 20-30 lines"},
            {"role": "user", "content": data.question}
        ],
    )
    return {"answer": response.choices[0].message.content}


# ===============================
# ROADMAP ROUTE
# ===============================
@app.post("/roadmap")
async def roadmap(data: RoadmapRequest):

    prompt = f"""
Generate a biotechnology learning roadmap in a short and simple manner.

Goal: {data.goal}
Level: {data.level}

Include:
- Subjects
- Skills
- Tools
- Certifications
- Project ideas
- Career opportunities
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
    )

    return {"roadmap": response.choices[0].message.content}


# ===============================
# QUIZ ROUTE
# ===============================
@app.post("/question")
async def generate_questions(data: QuizRequest):

    prompt = f"""
Generate {data.num_questions} biotechnology multiple choice questions
on the topic: {data.topic}
Difficulty: {data.level}

STRICT RULES:
- Return ONLY valid JSON.
- No explanation.
- No markdown.
- No extra text.

Format:
[
  {{
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Correct option exactly as written"
  }}
]
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )

    content = response.choices[0].message.content.strip()

    match = re.search(r"\[.*\]", content, re.DOTALL)

    if not match:
        return {"questions": []}

    try:
        questions = json.loads(match.group(0))
        if not isinstance(questions, list):
            return {"questions": []}
    except:
        return {"questions": []}

    return {"questions": questions}


# ===============================
# REGISTER ROUTE
# ===============================
@app.post("/register")
async def register(user: UserRegister):

    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    # FIX: Truncate to 72 bytes before hashing to satisfy bcrypt limit
    safe_password = user.password.encode('utf-8')[:72]
    hashed_password = pwd_context.hash(safe_password)

    users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "password": hashed_password
    })

    return {"message": "User registered successfully"}


# ===============================
# LOGIN ROUTE
# ===============================
@app.post("/login")
async def login(user: UserLogin):

    db_user = users_collection.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # FIX: Truncate to 72 bytes before verifying to match the registration logic
    safe_password = user.password.encode('utf-8')[:72]
    if not pwd_context.verify(safe_password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid password")

    token_data = {
        "sub": db_user["email"],
        "exp": datetime.utcnow() + timedelta(hours=2)
    }

    token = jwt.encode(token_data, JWT_SECRET, algorithm="HS256")

    return {"access_token": token}



# ===============================
# SAVE QUIZ RESULT
# ===============================
@app.post("/save-result")
async def save_result(data: SaveQuizResult, user_email: str = Depends(verify_token)):

    # 🔥 Convert answer keys to string (MongoDB requires string keys)
    string_answers = {str(k): v for k, v in data.answers.items()}

    quiz_results_collection.insert_one({
        "email": user_email,
        "topic": data.topic,
        "level": data.level,
        "questions": data.questions,
        "answers": string_answers,  # 👈 FIXED
        "score": data.score,
        "total": data.total,
        "date": datetime.utcnow()
    })

    return {"message": "Result saved successfully"}

# ===============================
# GET USER RESULTS
# ===============================
@app.get("/my-results")
async def get_my_results(user_email: str = Depends(verify_token)):

    results = list(
        quiz_results_collection.find(
            {"email": user_email},
            {"_id": 0}
        )
    )

    return {"results": results}


# ===============================
# GET PROFILE
# ===============================
@app.get("/me")
async def get_profile(user_email: str = Depends(verify_token)):

    user = users_collection.find_one(
        {"email": user_email},
        {"_id": 0, "password": 0}
    )

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"user": user}


# ===============================
# DELETE ACCOUNT
# ===============================
@app.delete("/delete-account")
async def delete_account(user_email: str = Depends(verify_token)):

    users_collection.delete_one({"email": user_email})
    quiz_results_collection.delete_many({"email": user_email})

    return {"message": "Account deleted successfully"}