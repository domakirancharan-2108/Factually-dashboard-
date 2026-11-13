"""POST /api/publications — Create a new publication."""

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
            pub = json.loads(raw)

            if "id" not in pub:
                pub["id"] = "pub_" + os.urandom(4).hex()
            db.publications.insert_one(pub)
            pub.pop("_id", None)

            resp = make_response({"success": True, "publication": pub})
        except Exception as e:
            resp = make_response({"success": False, "error": str(e)}, 500)

        self.send_response(resp["statusCode"])
        for k, v in resp["headers"].items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(resp["body"].encode("utf-8"))
