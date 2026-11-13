"""GET /api/health — Health check endpoint."""

from http.server import BaseHTTPRequestHandler
from api._db import get_db, seed_database_if_empty, make_response, make_cors_preflight


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        resp = make_cors_preflight()
        self.send_response(resp["statusCode"])
        for k, v in resp["headers"].items():
            self.send_header(k, v)
        self.end_headers()

    def do_GET(self):
        try:
            db = get_db()
            seed_database_if_empty(db)
            doc_counts = {}
            for col in ["users", "facultyProfiles", "facultyActivities", "studentAchievements",
                        "publications", "researchGrants", "events", "placedOffers",
                        "laboratories", "nbaCriteria", "auditLogs"]:
                doc_counts[col] = db[col].count_documents({})

            resp = make_response({
                "status": "connected",
                "database": "vaagdevi_csm_db",
                "cluster": "department--dashboard.eibmzx4.mongodb.net",
                "counts": doc_counts,
                "message": "Connected to MongoDB Atlas Cluster"
            })
        except Exception as e:
            resp = make_response({
                "status": "disconnected",
                "database": "vaagdevi_csm_db",
                "cluster": "department--dashboard.eibmzx4.mongodb.net",
                "counts": {},
                "message": f"MongoDB Atlas Offline: {e}"
            })

        self.send_response(resp["statusCode"])
        for k, v in resp["headers"].items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(resp["body"].encode("utf-8"))
