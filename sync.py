"""GET + POST /api/db/sync — Full database sync endpoint."""

import json
from http.server import BaseHTTPRequestHandler
from api._db import (get_db, seed_database_if_empty, make_response,
                     make_cors_preflight, parse_body, clean_docs,
                     DEFAULT_SYSTEM_CONFIG)


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
            resp = make_response({"success": True, "data": data})
        except Exception as e:
            resp = make_response({"success": False, "error": str(e)}, 500)

        self.send_response(resp["statusCode"])
        for k, v in resp["headers"].items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(resp["body"].encode("utf-8"))

    def do_POST(self):
        try:
            db = get_db()
            content_length = int(self.headers.get("Content-Length", 0))
            raw = self.rfile.read(content_length).decode("utf-8") if content_length > 0 else "{}"
            body = json.loads(raw)

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

            resp = make_response({"success": True, "message": "Synced to MongoDB Atlas"})
        except Exception as e:
            resp = make_response({"success": False, "error": str(e)}, 500)

        self.send_response(resp["statusCode"])
        for k, v in resp["headers"].items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(resp["body"].encode("utf-8"))
