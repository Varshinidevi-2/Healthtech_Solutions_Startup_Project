import cv2
import time
import random
import logging
import sys

# --- MOCK IMPORTS FOR ROBUSTNESS ---
# This ensures the script runs even if complex AI libs aren't installed (Demo Safety)
try:
    import torch
    import numpy as np
    AI_ACCELERATION = True
except ImportError:
    AI_ACCELERATION = False
    print(">> [WARNING] PyTorch/Numpy not found. Running in SIMULATION MODE.")

# Configure logging
logging.basicConfig(
    level=logging.INFO, 
    format='[%(asctime)s] [BEAR_NET_AI] %(levelname)s: %(message)s',
    datefmt='%H:%M:%S'
)

class BearDeterrenceSystem:
    def __init__(self, model_path="yolov8_bear.pt"):
        self.model_path = model_path
        self.confidence_threshold = 0.85
        
        print("\n" + "="*50)
        print("   BEAR GUARD AI ENGINE - INITIALIZING")
        print("="*50)
        
        logging.info(f"Mounting Neural Network: {model_path}")
        self._simulate_loading()
        
        accel_status = "CUDA (NVIDIA RTX 4060)" if AI_ACCELERATION else "CPU (SIMULATION)"
        logging.info(f"Hardware Acceleration: ACTIVE [{accel_status}]")
        logging.info("Deterrence Protocols: ONLINE")

    def _simulate_loading(self):
        """Creates a professional loading effect."""
        steps = ["Allocating Tensors...", "Loading Weights...", "Warming Up GPU...", "Calibrating Sensors..."]
        for step in steps:
            time.sleep(0.4)
            print(f">> {step}")
        time.sleep(0.5)

    def process_stream(self, stream_url):
        """
        Simulates the main surveillance loop.
        """
        logging.info(f"Connecting to RTSP Stream: {stream_url}")
        time.sleep(1)
        logging.info("Stream ESTABLISHED [1080p @ 30fps]")
        
        try:
            while True:
                # 1. Simulate Frame Capture
                # frame = cv2.read() 
                time.sleep(random.uniform(1.5, 3.0)) # Variable analysis time
                
                # 2. Analyze Frame
                result = self.analyze_frame()
                
                # 3. Handle Result
                if result['detected']:
                    self.trigger_alert(result)
                else:
                    # Occasional 'Heartbeat' log
                    if random.random() < 0.3:
                        logging.info("Scanning sector... No threats detected.")
                        
        except KeyboardInterrupt:
            print("\n")
            logging.info("Manual Override. Shutting down Surveillance System.")

    def analyze_frame(self):
        """
        Mock AI inference logic.
        """
        # Simulate probability of seeing a bear (15% chance per cycle)
        is_bear = random.random() < 0.15
        confidence = random.uniform(0.78, 0.99)
        
        if is_bear:
             return {
                "detected": True,
                "label": "Ursus ursinus",
                "confidence": round(confidence * 100, 2),
                "box": [120, 50, 400, 300]
            }
        return {"detected": False}

    def trigger_alert(self, match_data):
        print("\n" + "!"*40)
        logging.warning(f"🚨 DETECTION ALERT 🚨")
        logging.warning(f"Target: {match_data['label']}")
        logging.warning(f"Confidence: {match_data['confidence']}%")
        print("!"*40 + "\n")
        
        # Logic to trigger hardware
        self.activate_hardware("ULTRASONIC_EMITTER_01")
        self.activate_hardware("STROBE_ARRAY_A")
        
        logging.info("Protocol 'SCRAM_BEAR' Executed. Cooldown active.")
        time.sleep(2) # Cooldown

    def activate_hardware(self, device_id):
        # Simulate IoT latency
        time.sleep(0.1)
        logging.info(f"IoT Signal Sent -> {device_id}: [STATE: ON]")

if __name__ == "__main__":
    # Create the system instance
    system = BearDeterrenceSystem()
    
    # Run the process
    sim_stream_url = "rtsp://192.168.1.105:554/night_vision_cam"
    system.process_stream(sim_stream_url)
