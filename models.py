from pydantic import BaseModel, EmailStr
from typing import List, Dict
from pydantic import BaseModel

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class SaveQuizResult(BaseModel):
    topic: str
    level: str
    questions: List[dict]
    answers: Dict[int, str]
    score: int
    total: int