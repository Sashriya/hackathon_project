from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient("mongodb://localhost:27017")

db = client["biotech_ai"]
quiz_results_collection = db["quiz_results"]
contact_collection = db["contact_messages"]

users_collection = db["users"]