"""PUT + DELETE /api/users/[id] — Update or delete a user."""

import json
from http.server import BaseHTTPRequestHandler
from api._db import get_db, make_response, make_cors_preflight


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        resp = make_cors_preflight()
        self.send_response(resp["statusCode"])
        for k, v in resp["headers"].items():
            self.send_header(k, v)
        self.end_headers()

    def _get_user_id(self):
        # Path will be like /api/users/usr_abc123
        path = self.path.split("?")[0]
        return path.replace("/api/users/", "").strip()

    def do_PUT(self):
        try:
            db = get_db()
            user_id = self._get_user_id()
            content_length = int(self.headers.get("Content-Length", 0))
            raw = self.rfile.read(content_length).decode("utf-8") if content_length > 0 else "{}"
            body = json.loads(raw)

            db.users.update_one({"id": user_id}, {"$set": body}, upsert=False)

            # If facultyProfile exists, update matching fields
            fac_update = {}
            for field in ["name", "designation", "subject", "teachingWorkload", "qualification"]:
                if field in body:
                    fac_update[field] = body[field]
            if fac_update:
                db.facultyProfiles.update_one({"facultyId": user_id}, {"$set": fac_update})

            updated_user = db.users.find_one({"id": user_id}, {"_id": 0})
            resp = make_response({"success": True, "user": updated_user})
        except Exception as e:
            resp = make_response({"success": False, "error": str(e)}, 500)

        self.send_response(resp["statusCode"])
        for k, v in resp["headers"].items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(resp["body"].encode("utf-8"))

    def do_DELETE(self):
        try:
            db = get_db()
            user_id = self._get_user_id()
            res = db.users.delete_one({"id": user_id})
            db.facultyProfiles.delete_one({"facultyId": user_id})
            resp = make_response({"success": True, "deletedCount": res.deleted_count})
        except Exception as e:
            resp = make_response({"success": False, "error": str(e)}, 500)

        self.send_response(resp["statusCode"])
        for k, v in resp["headers"].items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(resp["body"].encode("utf-8"))
