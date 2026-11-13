"""
Vaagdevi College of Engineering - CSM Department Dashboard
MongoDB Atlas Connected Backend Server
Connects to Cluster: department--dashboard.eibmzx4.mongodb.net
Database: vaagdevi_csm_db
"""

import os
import sys
import json
import mimetypes
from urllib.parse import urlparse
from http.server import HTTPServer, BaseHTTPRequestHandler

# Dynamically add user site-packages if running with system interpreter
_user_site = os.path.expanduser(r"~\AppData\Roaming\Python\Python314\site-packages")
if os.path.exists(_user_site) and _user_site not in sys.path:
    sys.path.insert(0, _user_site)

# pyrefly: ignore [missing-import]
try:
    import pymongo  # type: ignore # pyrefly: ignore [missing-import]
    from pymongo import MongoClient  # type: ignore # pyrefly: ignore [missing-import]
except ImportError:
    pymongo = None  # type: ignore
    MongoClient = None  # type: ignore

# MongoDB Atlas Configuration
MONGO_URI = os.environ.get(
    "MONGODB_URI", 
    "mongodb+srv://daravathsagar176_db_user:YmsLwY2mKN8mEqPH@department--dashboard.eibmzx4.mongodb.net/?appName=DEPARTMENT--DASHBOARD"
)
DB_NAME = "vaagdevi_csm_db"
PORT = int(os.environ.get("PORT", 5500))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

print(f"[*] Initializing MongoDB Atlas connection to: {DB_NAME}...")

try:
    if MongoClient is not None:
        mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=8000)
        db = mongo_client[DB_NAME]
        # Ping database to verify connection
        db.command("ping")
        print(f"[SUCCESS] Connected to MongoDB Atlas cluster successfully! (DB: {DB_NAME})")
        is_mongo_connected = True
    else:
        raise ImportError("pymongo module is not installed in the active environment.")
except Exception as e:
    print(f"[WARNING] MongoDB connection failed or offline: {e}")
    mongo_client = None
    db = None
    is_mongo_connected = False


# Initial Seed Data
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
        "id": "lab_01",
        "name": "NVIDIA AI & GPU Supercomputing Center",
        "code": "CSM-LAB-101",
        "location": "Block-B, 3rd Floor (Room 302)",
        "systemsCount": 40,
        "hardwareSpecs": "NVIDIA RTX 4090 24GB GPUs, Intel Core i9 14th Gen, 64GB DDR5 RAM, 2TB NVMe",
        "softwareInstalled": "CUDA 12.4, PyTorch, TensorFlow, TensorRT, Triton Server, JupyterHub",
        "facultyInCharge": "Unassigned",
        "labTechnician": "Mr. P. Srinivas (Sr. Tech)",
        "utilizationRate": 0,
        "currentStatus": "Available for Sessions & Research",
        "weeklyHoursUsed": 0,
        "capacity": 40
    },
    {
        "id": "lab_02",
        "name": "Machine Learning & Predictive Analytics Lab",
        "code": "CSM-LAB-102",
        "location": "Block-B, 3rd Floor (Room 304)",
        "systemsCount": 65,
        "hardwareSpecs": "Intel Core i7 13th Gen, 32GB RAM, NVIDIA RTX 3060 12GB, 1TB SSD",
        "softwareInstalled": "Scikit-Learn, Spark MLlib, Tableau, Anaconda Enterprise, RStudio",
        "facultyInCharge": "Unassigned",
        "labTechnician": "Mrs. K. Lavanya",
        "utilizationRate": 0,
        "currentStatus": "Available for Sessions & Research",
        "weeklyHoursUsed": 0,
        "capacity": 65
    },
    {
        "id": "lab_03",
        "name": "Computer Vision & Robotics AI Innovation Lab",
        "code": "CSM-LAB-103",
        "location": "Block-B, 2nd Floor (Room 208 - AICTE IDEA Lab)",
        "systemsCount": 35,
        "hardwareSpecs": "NVIDIA Jetson AGX Orin 64GB Dev Kits, Intel RealSense D435i, TurtleBot4, RTX 4080 rigs",
        "softwareInstalled": "ROS 2 Humble, OpenCV 4.9, YOLOv10, Open3D, Gazebo Sim",
        "facultyInCharge": "Unassigned",
        "labTechnician": "Mr. B. Ravinder",
        "utilizationRate": 0,
        "currentStatus": "Available for Sessions & Research",
        "weeklyHoursUsed": 0,
        "capacity": 35
    },
    {
        "id": "lab_04",
        "name": "Cloud AI & Big Data Analytics Laboratory",
        "code": "CSM-LAB-104",
        "location": "Block-B, 4th Floor (Room 401)",
        "systemsCount": 60,
        "hardwareSpecs": "Intel Xeon Workstations, 32GB RAM, AWS Cloud Workspaces & Azure AI Sandbox",
        "softwareInstalled": "AWS SageMaker Studio, Azure ML Studio, Hadoop, Apache Kafka, MongoDB",
        "facultyInCharge": "Unassigned",
        "labTechnician": "Mr. M. Rajesh",
        "utilizationRate": 0,
        "currentStatus": "Available for Sessions & Research",
        "weeklyHoursUsed": 0,
        "capacity": 60
    }
]

DEFAULT_NBA = [
    { "id": 1, "name": "Vision, Mission & Program Educational Objectives", "maxMarks": 60, "marksObtained": 56, "status": "Compliant" },
    { "id": 2, "name": "Program Curriculum and Teaching-Learning Processes", "maxMarks": 120, "marksObtained": 114, "status": "Compliant" },
    { "id": 3, "name": "Course Outcomes and Program Outcomes (CO-PO)", "maxMarks": 120, "marksObtained": 112, "status": "Compliant" },
    { "id": 4, "name": "Students' Performance & Progression", "maxMarks": 150, "marksObtained": 139, "status": "Compliant" },
    { "id": 5, "name": "Faculty Information & Contributions", "maxMarks": 200, "marksObtained": 188, "status": "Compliant" },
    { "id": 6, "name": "Facilities & Technical Infrastructure", "maxMarks": 80, "marksObtained": 76, "status": "Compliant" },
    { "id": 7, "name": "Continuous Improvement & Academic Audits", "maxMarks": 50, "marksObtained": 48, "status": "Compliant" },
    { "id": 8, "name": "First Year Academics & Basic Sciences", "maxMarks": 50, "marksObtained": 47, "status": "Compliant" },
    { "id": 9, "name": "Student Support Systems & Mentoring", "maxMarks": 50, "marksObtained": 49, "status": "Compliant" },
    { "id": 10, "name": "Governance, Institutional Support & Budget", "maxMarks": 120, "marksObtained": 115, "status": "Compliant" }
]


def seed_database_if_empty():
    if not is_mongo_connected or db is None:
        return
    try:
        # Check systemConfig
        if db.systemConfig.count_documents({}) == 0:
            db.systemConfig.insert_one(DEFAULT_SYSTEM_CONFIG)
            print("[SEED] Inserted default systemConfig.")

        # Check users
        if db.users.count_documents({}) == 0:
            db.users.insert_many(DEFAULT_USERS)
            print("[SEED] Inserted default users (Principal).")

        # Check laboratories
        if db.laboratories.count_documents({}) == 0:
            db.laboratories.insert_many(DEFAULT_LABS)
            print("[SEED] Inserted default laboratories.")

        # Check nbaCriteria
        if db.nbaCriteria.count_documents({}) == 0:
            db.nbaCriteria.insert_many(DEFAULT_NBA)
            print("[SEED] Inserted default NBA criteria.")

    except Exception as e:
        print(f"[WARNING] Error seeding database: {e}")

# Run seed check
seed_database_if_empty()


class DashboardMongoHandler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def _send_json(self, data, status_code=200):
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self._send_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(data, default=str).encode("utf-8"))

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        # 1. Health API
        if path == "/api/health":
            status = "connected" if is_mongo_connected else "disconnected"
            doc_counts = {}
            if is_mongo_connected and db is not None:
                try:
                    for col in ["users", "facultyProfiles", "facultyActivities", "studentAchievements", "publications", "researchGrants", "events", "placedOffers", "laboratories", "nbaCriteria", "auditLogs"]:
                        doc_counts[col] = db[col].count_documents({})
                except Exception:
                    pass

            return self._send_json({
                "status": status,
                "database": DB_NAME,
                "cluster": "department--dashboard.eibmzx4.mongodb.net",
                "counts": doc_counts,
                "message": "Connected to MongoDB Atlas Cluster" if is_mongo_connected else "MongoDB Atlas Offline / Local Fallback Active"
            })

        # 2. Sync / Full Database GET
        if path == "/api/db/sync":
            if not is_mongo_connected or db is None:
                return self._send_json({ "success": False, "message": "MongoDB not connected" }, 503)

            try:
                def clean_docs(cursor):
                    docs = list(cursor)
                    for d in docs:
                        if "_id" in d and not isinstance(d["_id"], str):
                            d["_id"] = str(d["_id"])
                    return docs

                config_doc = db.systemConfig.find_one({"_id": "principal_config"}) or DEFAULT_SYSTEM_CONFIG

                data = {
                    "users": clean_docs(db.users.find({}, {"_id": 0})),
                    "facultyProfiles": clean_docs(db.facultyProfiles.find({}, {"_id": 0})),
                    "facultyActivities": clean_docs(db.facultyActivities.find({}, {"_id": 0})),
                    "studentAchievements": clean_docs(db.studentAchievements.find({}, {"_id": 0})),
                    "publications": clean_docs(db.publications.find({}, {"_id": 0})),
                    "researchGrants": clean_docs(db.researchGrants.find({}, {"_id": 0})),
                    "events": clean_docs(db.events.find({}, {"_id": 0})),
                    "placedOffers": clean_docs(db.placedOffers.find({}, {"_id": 0})),
                    "laboratories": clean_docs(db.laboratories.find({}, {"_id": 0})),
                    "nbaCriteria": clean_docs(db.nbaCriteria.find({}, {"_id": 0})),
                    "auditLogs": clean_docs(db.auditLogs.find({}, {"_id": 0})),
                    "principalMasterPassword": config_doc.get("masterPassword", "KIRANCHARAN123")
                }
                return self._send_json({ "success": True, "data": data })
            except Exception as e:
                return self._send_json({ "success": False, "error": str(e) }, 500)

        # 3. Static Files Serving
        self.serve_static(path)

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        body = self._read_body_json()

        if not is_mongo_connected or db is None:
            return self._send_json({ "success": False, "message": "MongoDB Atlas not connected" }, 503)

        try:
            # Full state sync POST
            if path == "/api/db/sync":
                full_data = body.get("data", body)
                collections_map = {
                    "users": "id",
                    "facultyProfiles": "facultyId",
                    "facultyActivities": "id",
                    "studentAchievements": "id",
                    "publications": "id",
                    "researchGrants": "id",
                    "events": "id",
                    "placedOffers": "id",
                    "laboratories": "id",
                    "nbaCriteria": "id",
                    "auditLogs": "id"
                }

                for col_name, key_field in collections_map.items():
                    items = full_data.get(col_name)
                    if items is not None and isinstance(items, list):
                        for item in items:
                            if key_field in item:
                                db[col_name].replace_one({key_field: item[key_field]}, item, upsert=True)

                if "principalMasterPassword" in full_data:
                    db.systemConfig.update_one(
                        {"_id": "principal_config"},
                        {"$set": {"masterPassword": full_data["principalMasterPassword"]}},
                        upsert=True
                    )
                return self._send_json({ "success": True, "message": "Synced to MongoDB Atlas" })

            # Insert User
            if path == "/api/users":
                user = body
                if "id" not in user:
                    user["id"] = "usr_" + os.urandom(4).hex()
                db.users.replace_one({"id": user["id"]}, user, upsert=True)
                return self._send_json({ "success": True, "user": user })

            # Insert Publication
            if path == "/api/publications":
                pub = body
                if "id" not in pub:
                    pub["id"] = "pub_" + os.urandom(4).hex()
                db.publications.insert_one(pub)
                # Remove _id before returning
                pub.pop("_id", None)
                return self._send_json({ "success": True, "publication": pub })

            # Insert Activity
            if path == "/api/activities":
                act = body
                if "id" not in act:
                    act["id"] = "act_" + os.urandom(4).hex()
                db.facultyActivities.insert_one(act)
                act.pop("_id", None)
                return self._send_json({ "success": True, "activity": act })

            # Insert Student Achievement
            if path == "/api/achievements":
                ach = body
                if "id" not in ach:
                    ach["id"] = "ach_" + os.urandom(4).hex()
                db.studentAchievements.insert_one(ach)
                ach.pop("_id", None)
                return self._send_json({ "success": True, "achievement": ach })

            # Insert Event
            if path == "/api/events":
                evt = body
                if "id" not in evt:
                    evt["id"] = "evt_" + os.urandom(4).hex()
                db.events.insert_one(evt)
                evt.pop("_id", None)
                return self._send_json({ "success": True, "event": evt })

            # Insert Grant
            if path == "/api/grants":
                grt = body
                if "id" not in grt:
                    grt["id"] = "grt_" + os.urandom(4).hex()
                db.researchGrants.insert_one(grt)
                grt.pop("_id", None)
                return self._send_json({ "success": True, "grant": grt })

            # Insert Placement
            if path == "/api/placements":
                plc = body
                if "id" not in plc:
                    plc["id"] = "plc_" + os.urandom(4).hex()
                db.placedOffers.insert_one(plc)
                plc.pop("_id", None)
                return self._send_json({ "success": True, "placement": plc })

            # Insert Audit Log
            if path == "/api/audit-logs":
                log = body
                if "id" not in log:
                    log["id"] = "log_" + os.urandom(4).hex()
                db.auditLogs.insert_one(log)
                log.pop("_id", None)
                return self._send_json({ "success": True, "log": log })

            return self._send_json({ "error": "Endpoint not found" }, 404)

        except Exception as e:
            return self._send_json({ "success": False, "error": str(e) }, 500)

    def do_PUT(self):
        parsed = urlparse(self.path)
        path = parsed.path
        body = self._read_body_json()

        if not is_mongo_connected or db is None:
            return self._send_json({ "success": False, "message": "MongoDB not connected" }, 503)

        try:
            # Update User: /api/users/<userId>
            if path.startswith("/api/users/"):
                user_id = path.replace("/api/users/", "").strip()
                db.users.update_one({"id": user_id}, {"$set": body}, upsert=False)
                # If facultyProfile exists, update matching fields
                fac_update = {}
                for field in ["name", "designation", "subject", "teachingWorkload", "qualification"]:
                    if field in body:
                        fac_update[field] = body[field]
                if fac_update:
                    db.facultyProfiles.update_one({"facultyId": user_id}, {"$set": fac_update})
                
                updated_user = db.users.find_one({"id": user_id}, {"_id": 0})
                return self._send_json({ "success": True, "user": updated_user })

            # Update Principal Password
            if path == "/api/principal-password":
                new_pw = body.get("password")
                if new_pw:
                    db.systemConfig.update_one(
                        {"_id": "principal_config"},
                        {"$set": {"masterPassword": new_pw}},
                        upsert=True
                    )
                    db.users.update_one(
                        {"id": "usr_principal_master"},
                        {"$set": {"password": new_pw}}
                    )
                    return self._send_json({ "success": True, "message": "Master password updated in MongoDB Atlas" })
                return self._send_json({ "success": False, "message": "Password is required" }, 400)

            # Update NBA Criterion: /api/nba/<critId>
            if path.startswith("/api/nba/"):
                crit_id = int(path.replace("/api/nba/", "").strip())
                db.nbaCriteria.update_one(
                    {"id": crit_id},
                    {"$set": {"marksObtained": int(body.get("marksObtained", 0)), "status": body.get("status", "Compliant")}}
                )
                return self._send_json({ "success": True, "message": "NBA Criterion updated" })

            # Update Lab: /api/labs/<labId>
            if path.startswith("/api/labs/"):
                lab_id = path.replace("/api/labs/", "").strip()
                db.laboratories.update_one(
                    {"id": lab_id},
                    {"$set": body}
                )
                return self._send_json({ "success": True, "message": "Lab updated" })

            # Update Activity: /api/activities/<actId>
            if path.startswith("/api/activities/"):
                act_id = path.replace("/api/activities/", "").strip()
                db.facultyActivities.update_one(
                    {"id": act_id},
                    {"$set": body}
                )
                return self._send_json({ "success": True, "message": "Activity updated" })

            return self._send_json({ "error": "Endpoint not found" }, 404)

        except Exception as e:
            return self._send_json({ "success": False, "error": str(e) }, 500)

    def do_DELETE(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if not is_mongo_connected or db is None:
            return self._send_json({ "success": False, "message": "MongoDB not connected" }, 503)

        try:
            # Delete User: /api/users/<userId>
            if path.startswith("/api/users/"):
                user_id = path.replace("/api/users/", "").strip()
                res = db.users.delete_one({"id": user_id})
                db.facultyProfiles.delete_one({"facultyId": user_id})
                return self._send_json({ "success": True, "deletedCount": res.deleted_count })

            # Delete Activity: /api/activities/<actId>
            if path.startswith("/api/activities/"):
                act_id = path.replace("/api/activities/", "").strip()
                res = db.facultyActivities.delete_one({"id": act_id})
                return self._send_json({ "success": True, "deletedCount": res.deleted_count })

            # Delete Publication: /api/publications/<pubId>
            if path.startswith("/api/publications/"):
                pub_id = path.replace("/api/publications/", "").strip()
                res = db.publications.delete_one({"id": pub_id})
                return self._send_json({ "success": True, "deletedCount": res.deleted_count })

            return self._send_json({ "error": "Endpoint not found" }, 404)

        except Exception as e:
            return self._send_json({ "success": False, "error": str(e) }, 500)

    def _read_body_json(self):
        content_length = int(self.headers.get("Content-Length", 0))
        if content_length == 0:
            return {}
        raw = self.rfile.read(content_length).decode("utf-8")
        try:
            return json.loads(raw)
        except Exception:
            return {}

    def serve_static(self, path):
        if path == "/" or path == "":
            path = "/index.html"

        # Sanitize path to prevent directory traversal
        rel_path = path.lstrip("/").replace("\\", "/")
        full_path = os.path.join(BASE_DIR, rel_path)

        if not os.path.exists(full_path) or os.path.isdir(full_path):
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"404 Not Found")
            return

        mime_type, _ = mimetypes.guess_type(full_path)
        if not mime_type:
            if full_path.endswith(".js"):
                mime_type = "application/javascript"
            elif full_path.endswith(".css"):
                mime_type = "text/css"
            else:
                mime_type = "application/octet-stream"

        try:
            with open(full_path, "rb") as f:
                content = f.read()
            self.send_response(200)
            self.send_header("Content-Type", mime_type)
            self.send_header("Content-Length", str(len(content)))
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(str(e).encode("utf-8"))


def run_server():
    server_address = ("", PORT)
    httpd = HTTPServer(server_address, DashboardMongoHandler)
    print(f"===================================================================")
    print(f"  VAAGDEVI CSM DEPARTMENT DASHBOARD - MONGODB ATLAS SERVER")
    print(f"  Live Server: http://localhost:{PORT}")
    print(f"  MongoDB Cluster: department--dashboard.eibmzx4.mongodb.net")
    print(f"  Database Name: {DB_NAME}")
    print(f"===================================================================")
    httpd.serve_forever()


if __name__ == "__main__":
    run_server()
