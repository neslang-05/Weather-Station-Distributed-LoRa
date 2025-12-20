from flask import Flask, send_from_directory
import os

app = Flask(__name__)

# Serve the main index.html
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# Serve static files (css, js, etc.) from the root and subdirectories
@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

if __name__ == '__main__':
    print("--- Weather Station Flask Server ---")
    print("Local: http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
