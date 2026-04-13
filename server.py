#!/usr/bin/env python3
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import datetime

class MemberHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/save-member':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            
            # Create directory if it doesn't exist
            member_dir = r"C:\Users\micha\CascadeProjects\windsurf-project-2\member stuff"
            os.makedirs(member_dir, exist_ok=True)
            
            # Write to file
            file_path = os.path.join(member_dir, 'members.txt')
            
            try:
                with open(file_path, 'a', encoding='utf-8') as f:
                    f.write(post_data)
                
                self.send_response(200)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(b'Success')
                print(f"Mitgliedsdaten gespeichert in {file_path}")
                
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(f'Error: {str(e)}'.encode('utf-8'))
                print(f"Fehler beim Speichern: {e}")
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_GET(self):
        # Serve static files
        if self.path == '/':
            self.path = '/index.html'
        
        try:
            with open(self.path[1:], 'rb') as f:
                self.send_response(200)
                if self.path.endswith('.css'):
                    self.send_header('Content-type', 'text/css')
                elif self.path.endswith('.js'):
                    self.send_header('Content-type', 'application/javascript')
                else:
                    self.send_header('Content-type', 'text/html')
                self.end_headers()
                self.wfile.write(f.read())
        except FileNotFoundError:
            self.send_response(404)
            self.end_headers()
    
    def log_message(self, format, *args):
        # Suppress default logging
        pass

if __name__ == '__main__':
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, MemberHandler)
    print("Server läuft auf http://localhost:8000")
    print("Mitgliedsdaten werden in 'member stuff/members.txt' gespeichert")
    httpd.serve_forever()
