from flask import Flask, jsonify, request, send_from_directory
import time
import os
import random

app = Flask(__name__, static_folder='.')

# --- Configuration ---
PORT = 5000
API_VERSION = "v1"

# --- Routes ---

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

# --- API Endpoints ---

@app.route(f'/api/{API_VERSION}/status', methods=['GET'])
def get_system_status():
    """
    Returns the real-time status of the BearGuard network.
    """
    # Simulate hardware checks
    return jsonify({
        "system": "online",
        "gpu_load": f"{random.randint(20, 45)}%",
        "uptime": "48h 12m",
        "connected_sensors": 12,
        "deterrence_systems": "ready"
    })

@app.route(f'/api/{API_VERSION}/history', methods=['GET'])
def get_incident_history():
    """
    Returns simulated database records for incident logs.
    """
    incidents = [
        {"id": 402, "time": "02:15 AM", "loc": "Market Entrance", "conf": "94%", "action": "Sonic Blast", "status": "Resolved"},
        {"id": 401, "time": "03:40 AM", "loc": "Vegetable Lane", "conf": "89%", "action": "Ranger Alerted", "status": "High Priority"},
        {"id": 399, "time": "11:20 PM", "loc": "Dumpster Area 4", "conf": "91%", "action": "Strobe Flash", "status": "Resolved"}
    ]
    return jsonify(incidents)

@app.route(f'/api/{API_VERSION}/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    # Simple Mock Auth
    if (username == 'admin' and password == 'admin123') or \
       (username == 'chief' and password == 'bear'):
        return jsonify({"auth": True, "token": "bg_secure_77281", "role": "Warden"}), 200
        
    return jsonify({"auth": False, "message": "Invalid credentials"}), 401

@app.route(f'/api/{API_VERSION}/trigger_simulation', methods=['POST'])
def trigger_sim():
    """
    Endpoint for the frontend to request a backend-validated aleart simulation.
    """
    time.sleep(0.5) # Simulate processing
    return jsonify({
        "alert": True,
        "type": "Ursus ursinus",
        "confidence": 98.4,
        "location": "Sector 4 - Upper Road",
        "timestamp": time.time()
    })

if __name__ == '__main__':
    print(f"BearGuard Server starting on port {PORT}...")
    print("Serving frontend from root directory.")
    app.run(debug=True, port=PORT, host='0.0.0.0')
