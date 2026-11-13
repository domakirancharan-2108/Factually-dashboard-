"""
Shared MongoDB connection helper for Vercel serverless functions.
Reuses the connection across warm invocations.
"""

import os
import json
import certifi
from pymongo import MongoClient
from http.server import BaseHTTPRequestHandler

# MongoDB Atlas Configuration
MONGO_URI = os.environ.get(
    "MONGODB_URI",
    "mongodb+srv://daravathsagar176_db_user:YmsLwY2mKN8mEqPH@department--dashboard.eibmzx4.mongodb.net/?appName=DEPARTMENT--DASHBOARD"
)
DB_NAME = "vaagdevi_csm_db"

# Connection cache (reused across warm invocations)
_client = None
_db = None


def get_db():
    """Get or create a MongoDB connection."""
    global _client, _db
    if _client is None:
        _client = MongoClient(
            MONGO_URI,
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=8000
        )
        _db = _client[DB_NAME]
    return _db


def get_client():
    """Get or create the MongoClient."""
    global _client
    if _client is None:
        get_db()
    return _client


# Default seed data
DEFAULT_SYSTEM_CONFIG = {
    "_id": "principal_config",
    "masterPassword": "KIRANCHARAN123",
    "department": "CSE (AI & ML) - CSM",
    "college": "Vaagdevi College of Engineering (Autonomous), Warangal"
}

DEFAULT_USERS = [
    {
        "id": "usr_principal_master",
        "name": "DR. K. PRAKASH",
        "email": "principal@vaagdevi.edu.in",
        "username": "principal2026",
        "password": "KIRANCHARAN123",
        "role": "principal",
        "status": "approved",
        "designation": "Principal & Professor",
        "department": "College Administration & CSM Oversight",
        "employeeId": "100001",
        "subject": "AI & Institutional Governance",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        "phone": "+91 94401 23456",
        "joiningYear": 2012,
        "qualification": "Ph.D in Computer Science & Engineering"
    }
]

DEFAULT_LABS = [
    {
        "id": "lab_01", "name": "NVIDIA AI & GPU Supercomputing Center", "code": "CSM-LAB-101",
        "location": "Block-B, 3rd Floor (Room 302)", "systemsCount": 40,
        "hardwareSpecs": "NVIDIA RTX 4090 24GB GPUs, Intel Core i9 14th Gen, 64GB DDR5 RAM, 2TB NVMe",
        "softwareInstalled": "CUDA 12.4, PyTorch, TensorFlow, TensorRT, Triton Server, JupyterHub",
        "facultyInCharge": "Unassigned", "labTechnician": "Mr. P. Srinivas (Sr. Tech)",
        "utilizationRate": 0, "currentStatus": "Available for Sessions & Research",
        "weeklyHoursUsed": 0, "capacity": 40
    },
    {
        "id": "lab_02", "name": "Machine Learning & Predictive Analytics Lab", "code": "CSM-LAB-102",
        "location": "Block-B, 3rd Floor (Room 304)", "systemsCount": 65,
        "hardwareSpecs": "Intel Core i7 13th Gen, 32GB RAM, NVIDIA RTX 3060 12GB, 1TB SSD",
        "softwareInstalled": "Scikit-Learn, Spark MLlib, Tableau, Anaconda Enterprise, RStudio",
        "facultyInCharge": "Unassigned", "labTechnician": "Mrs. K. Lavanya",
        "utilizationRate": 0, "currentStatus": "Available for Sessions & Research",
        "weeklyHoursUsed": 0, "capacity": 65
    },
    {
        "id": "lab_03", "name": "Computer Vision & Robotics AI Innovation Lab", "code": "CSM-LAB-103",
        "location": "Block-B, 2nd Floor (Room 208 - AICTE IDEA Lab)", "systemsCount": 35,
        "hardwareSpecs": "NVIDIA Jetson AGX Orin 64GB Dev Kits, Intel RealSense D435i, TurtleBot4, RTX 4080 rigs",
        "softwareInstalled": "ROS 2 Humble, OpenCV 4.9, YOLOv10, Open3D, Gazebo Sim",
        "facultyInCharge": "Unassigned", "labTechnician": "Mr. B. Ravinder",
        "utilizationRate": 0, "currentStatus": "Available for Sessions & Research",
        "weeklyHoursUsed": 0, "capacity": 35
    },
    {
        "id": "lab_04", "name": "Cloud AI & Big Data Analytics Laboratory", "code": "CSM-LAB-104",
        "location": "Block-B, 4th Floor (Room 401)", "systemsCount": 60,
        "hardwareSpecs": "Intel Xeon Workstations, 32GB RAM, AWS Cloud Workspaces & Azure AI Sandbox",
        "softwareInstalled": "AWS SageMaker Studio, Azure ML Studio, Hadoop, Apache Kafka, MongoDB",
        "facultyInCharge": "Unassigned", "labTechnician": "Mr. M. Rajesh",
        "utilizationRate": 0, "currentStatus": "Available for Sessions & Research",
        "weeklyHoursUsed": 0, "capacity": 60
    }
]

DEFAULT_NBA = [
    {"id": 1, "name": "Vision, Mission and Program Educational Objectives (PEOs)", "maxMarks": 80, "marksObtained": 75, "status": "Compliant"},
    {"id": 2, "name": "Program Curriculum and Teaching-Learning Processes", "maxMarks": 100, "marksObtained": 92, "status": "Compliant"},
    {"id": 3, "name": "Course Outcomes and Program Outcomes (CO-PO)", "maxMarks": 120, "marksObtained": 112, "status": "Compliant"},
    {"id": 4, "name": "Students' Performance & Progression", "maxMarks": 150, "marksObtained": 139, "status": "Compliant"},
    {"id": 5, "name": "Faculty Information & Contributions", "maxMarks": 200, "marksObtained": 188, "status": "Compliant"},
    {"id": 6, "name": "Facilities & Technical Infrastructure", "maxMarks": 80, "marksObtained": 76, "status": "Compliant"},
    {"id": 7, "name": "Continuous Improvement & Academic Audits", "maxMarks": 50, "marksObtained": 48, "status": "Compliant"},
    {"id": 8, "name": "First Year Academics & Basic Sciences", "maxMarks": 50, "marksObtained": 47, "status": "Compliant"},
    {"id": 9, "name": "Student Support Systems & Mentoring", "maxMarks": 50, "marksObtained": 49, "status": "Compliant"},
    {"id": 10, "name": "Governance, Institutional Support & Budget", "maxMarks": 120, "marksObtained": 115, "status": "Compliant"}
]


def seed_database_if_empty(db):
    """Seed the database with default data if collections are empty."""
    try:
        if db.systemConfig.count_documents({}) == 0:
            db.systemConfig.insert_one(DEFAULT_SYSTEM_CONFIG)
        if db.users.count_documents({}) == 0:
            db.users.insert_many(DEFAULT_USERS)
        if db.laboratories.count_documents({}) == 0:
            db.laboratories.insert_many(DEFAULT_LABS)
        if db.nbaCriteria.count_documents({}) == 0:
            db.nbaCriteria.insert_many(DEFAULT_NBA)
    except Exception:
        pass


def make_response(body, status_code=200):
    """Create a Vercel-compatible HTTP response."""
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        },
        "body": json.dumps(body, default=str)
    }


def make_cors_preflight():
    """Return a CORS preflight response for OPTIONS requests."""
    return {
        "statusCode": 204,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        },
        "body": ""
    }


def parse_body(request):
    """Parse JSON body from a Vercel request."""
    try:
        body = request.body
        if isinstance(body, bytes):
            body = body.decode("utf-8")
        if isinstance(body, str) and body:
            return json.loads(body)
    except Exception:
        pass
    return {}


def clean_docs(cursor):
    """Clean MongoDB documents by converting ObjectId to string."""
    docs = list(cursor)
    for d in docs:
        if "_id" in d and not isinstance(d["_id"], str):
            d["_id"] = str(d["_id"])
    return docs
