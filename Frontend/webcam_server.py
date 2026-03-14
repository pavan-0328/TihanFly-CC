#!/usr/bin/env python3
"""
ULTRA-SMOOTH Webcam Streaming Server for TiHANFly GCS
OPTIMIZED FOR ZERO LAG - TV-QUALITY STREAMING
"""

from flask import Flask, Response, jsonify
from flask_cors import CORS
import cv2
import time
import threading

app = Flask(__name__)
CORS(app)

# Global variables
camera = None
frame_count = 0
current_frame = None
frame_lock = threading.Lock()
is_streaming = False

def initialize_camera():
    """Initialize webcam with MAXIMUM PERFORMANCE settings"""
    global camera
    
    # Try different camera indices
    for camera_id in [0, 1, 2]:
        camera = cv2.VideoCapture(camera_id, cv2.CAP_V4L2)  # Use V4L2 backend for Linux (fastest)
        if camera.isOpened():
            print(f"✅ Camera {camera_id} opened")
            break
    
    if not camera or not camera.isOpened():
        print("❌ Error: Could not open webcam")
        return False
    
    # ULTRA-OPTIMIZED SETTINGS FOR SMOOTH STREAMING
    camera.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    camera.set(cv2.CAP_PROP_FPS, 30)
    camera.set(cv2.CAP_PROP_BUFFERSIZE, 1)  # Minimize buffer = reduce lag
    camera.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*'MJPG'))
    
    # CRITICAL: Disable auto-settings for consistent frame timing
    camera.set(cv2.CAP_PROP_AUTOFOCUS, 0)
    camera.set(cv2.CAP_PROP_AUTO_EXPOSURE, 0.25)  # Manual exposure mode
    
    print("✅ Camera initialized for ULTRA-SMOOTH streaming")
    print(f"   Resolution: {int(camera.get(cv2.CAP_PROP_FRAME_WIDTH))}x{int(camera.get(cv2.CAP_PROP_FRAME_HEIGHT))}")
    print(f"   FPS: {int(camera.get(cv2.CAP_PROP_FPS))}")
    print(f"   Buffer: {int(camera.get(cv2.CAP_PROP_BUFFERSIZE))}")
    return True

def capture_frames():
    """Background thread for continuous frame capture - OPTIMIZED FOR SPEED"""
    global camera, frame_count, current_frame, is_streaming
    
    print("🎥 Frame capture thread started")
    
    while is_streaming:
        success, frame = camera.read()
        
        if not success:
            time.sleep(0.01)
            continue
        
        frame_count += 1
        
        # Store frame with minimal lock time
        with frame_lock:
            current_frame = frame
        
        # NO DELAY - capture as fast as possible
        # time.sleep(0.001)  # REMOVED for maximum speed

def generate_frames():
    """Generate MJPEG stream - OPTIMIZED FOR ZERO LAG"""
    global current_frame, frame_count
    
    print("📡 Stream client connected")
    
    last_frame_id = -1
    
    while True:
        # Get frame quickly
        with frame_lock:
            if current_frame is None:
                time.sleep(0.001)
                continue
            frame = current_frame
            current_frame_id = frame_count
        
        # Skip duplicate frames for smoother streaming
        if current_frame_id == last_frame_id:
            time.sleep(0.001)
            continue
        
        last_frame_id = current_frame_id
        
        # ULTRA-FAST ENCODING
        # Higher quality = 90-95 for smooth, clear video
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 90]
        ret, buffer = cv2.imencode('.jpg', frame, encode_param)
        
        if not ret:
            continue
        
        frame_bytes = buffer.tobytes()
        
        # Yield frame in MJPEG format with minimal headers
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n'
               b'Content-Length: ' + str(len(frame_bytes)).encode() + b'\r\n'
               b'\r\n' + frame_bytes + b'\r\n')

@app.route('/video_feed')
def video_feed():
    """Video streaming route - ULTRA-OPTIMIZED"""
    return Response(
        generate_frames(),
        mimetype='multipart/x-mixed-replace; boundary=frame',
        headers={
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'X-Accel-Buffering': 'no',  # Disable nginx buffering
            'Connection': 'keep-alive'   # Keep connection alive
        }
    )

@app.route('/status')
def status():
    """Check server status"""
    return jsonify({
        'status': 'active',
        'camera_active': camera is not None and camera.isOpened(),
        'frame_count': frame_count,
        'streaming': is_streaming
    })

@app.route('/stats')
def stats():
    """Get detailed statistics"""
    if camera and camera.isOpened():
        return jsonify({
            'fps': int(camera.get(cv2.CAP_PROP_FPS)),
            'width': int(camera.get(cv2.CAP_PROP_FRAME_WIDTH)),
            'height': int(camera.get(cv2.CAP_PROP_FRAME_HEIGHT)),
            'frame_count': frame_count,
            'streaming': is_streaming,
            'buffer_size': int(camera.get(cv2.CAP_PROP_BUFFERSIZE))
        })
    return jsonify({'error': 'Camera not active'}), 503

@app.route('/')
def index():
    """Root endpoint"""
    return f'''
    <!DOCTYPE html>
    <html>
    <head>
        <title>TiHANFly Webcam Server - ULTRA-SMOOTH</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                background: #0a0a0a;
                color: white;
                padding: 20px;
                margin: 0;
            }}
            h1 {{ color: #ff6b35; }}
            .info {{ 
                background: #1a1a1a; 
                padding: 15px; 
                border-radius: 8px; 
                margin: 20px 0;
                border-left: 4px solid #22c55e;
            }}
            .status {{ color: #22c55e; font-weight: bold; font-size: 18px; }}
            .streaming {{ color: #3b82f6; font-weight: bold; }}
            img {{ 
                max-width: 100%; 
                border: 3px solid #ff6b35; 
                border-radius: 8px;
                margin-top: 20px;
                display: block;
            }}
            a {{ color: #3b82f6; text-decoration: none; }}
            a:hover {{ color: #60a5fa; }}
        </style>
    </head>
    <body>
        <h1>🚁 TiHANFly Webcam Server - ULTRA-SMOOTH</h1>
        <div class="info">
            <p class="status">✅ Server Running - TV-Quality Streaming</p>
            <p>📡 Stream URL: <a href="/video_feed">/video_feed</a></p>
            <p>📊 Status: <a href="/status">/status</a></p>
            <p>📈 Stats: <a href="/stats">/stats</a></p>
            <p class="streaming">🎥 Frames: <span id="frameCount">{frame_count}</span></p>
        </div>
        <h2>📺 Live Preview (Zero Lag):</h2>
        <img src="/video_feed" alt="Live Webcam Feed">
        <script>
            setInterval(() => {{
                fetch('/status')
                    .then(r => r.json())
                    .then(d => {{
                        document.getElementById('frameCount').textContent = d.frame_count;
                    }});
            }}, 1000);
        </script>
    </body>
    </html>
    '''

@app.route('/health')
def health():
    """Health check"""
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    print("=" * 70)
    print("🚁 TiHANFly ULTRA-SMOOTH Webcam Server")
    print("=" * 70)
    
    if initialize_camera():
        # Start frame capture thread
        is_streaming = True
        capture_thread = threading.Thread(target=capture_frames, daemon=True)
        capture_thread.start()
        
        # Wait for first frame
        time.sleep(0.5)
        
        print(f"\n📡 Server running at: http://0.0.0.0:5000")
        print(f"🎥 Video feed: http://192.168.20.205:5000/video_feed")
        print(f"📊 Status: http://192.168.20.205:5000/status")
        print("=" * 70)
        print("⚡ ULTRA-SMOOTH MODE - TV-QUALITY STREAMING")
        print("📺 Zero lag, buttery smooth video")
        print("🎯 Press CTRL+C to stop")
        print("=" * 70)
        
        try:
            # Run Flask with ULTRA-OPTIMIZED settings
            app.run(
                host='0.0.0.0',
                port=5000,
                debug=False,           # Debug mode OFF
                threaded=True,         # Multi-threaded
                use_reloader=False     # No reloader
            )
        except KeyboardInterrupt:
            print("\n🛑 Shutting down server...")
        finally:
            is_streaming = False
            if camera:
                camera.release()
                print("✅ Camera released")
    else:
        print("❌ Failed to initialize camera")