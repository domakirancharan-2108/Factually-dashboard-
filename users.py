"""POST /api/users — Create a new user."""

import os
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

    def do_POST(self):
        try:
            db = get_db()
            content_length = int(self.headers.get("Content-Length", 0))
            raw = self.rfile.read(content_length).decode("utf-8") if content_length > 0 else "{}"
            user = json.loads(raw)

            if "id" not in user:
                user["id"] = "usr_" + os.urandom(4).hex()
            db.users.replace_one({"id": user["id"]}, user, upsert=True)

            resp = make_response({"success": True, "user": user})
        except Exception as e:
            resp = make_response({"success": False, "error": str(e)}, 500)

        self.send_response(resp["statusCode"])
        for k, v in resp["headers"].items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(resp["body"].encode("utf-8"))
