// Initialize variables
let video = document.getElementById('webcam');
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let model = null;
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Set canvas dimensions
canvas.width = 640;
canvas.height = 480;

// Load handtrack model
handTrack.load().then(loadedModel => {
    model = loadedModel;
    startVideo();
});

// Start webcam video
function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
            video.onloadedmetadata = () => {
                handTrack.startVideo(video).then(status => {
                    if (status) {
                        detectHand();
                    }
                });
            };
        })
        .catch(err => {
            console.error("Error accessing webcam:", err);
            alert("Please allow camera access to use this feature.");
        });
}

// Detect hand and draw
function detectHand() {
    model.detect(video).then(predictions => {
        // Filter predictions to include hands with reasonable confidence
        const validHands = predictions.filter(p => p.score > 0.7);
        
        if (validHands.length > 0) {
            const hand = validHands[0];
            // Use center of the hand bounding box
            const x = hand.bbox[0] + (hand.bbox[2] / 2);
            const y = hand.bbox[1] + (hand.bbox[3] / 2);
            
            if (!isDrawing) {
                isDrawing = true;
                lastX = x;
                lastY = y;
            }
            
            drawLine(x, y);
        } else {
            isDrawing = false;
        }
        requestAnimationFrame(detectHand);
    });
}

// Draw line on canvas
function drawLine(x, y) {
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    lastX = x;
    lastY = y;
}

// Clear canvas
document.getElementById('clearBtn').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Save drawing
document.getElementById('saveBtn').addEventListener('click', () => {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = dataURL;
    link.click();
});
