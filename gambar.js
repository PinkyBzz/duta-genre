document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const video = document.getElementById('webcam');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const statusIndicator = document.getElementById('status');
    const messageDiv = document.getElementById('message');
    const clearBtn = document.getElementById('clearBtn');
    const saveBtn = document.getElementById('saveBtn');
    const colorBtn = document.getElementById('colorBtn');
    
    let model = null;
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let currentColor = '#FFFFFF';
    let lineWidth = 5;
    
    // Drawing colors
    const colors = [
        '#FFFFFF', // white
        '#FF5252', // red
        '#FFEB3B', // yellow
        '#4CAF50', // green
        '#2196F3', // blue
        '#9C27B0', // purple
        '#FF9800', // orange
        '#E91E63', // pink
    ];
    
    // Set canvas dimensions to match video container
    function setCanvasDimensions() {
        const videoWrapper = document.querySelector('.video-wrapper');
        if (videoWrapper) {
            canvas.width = videoWrapper.clientWidth;
            canvas.height = videoWrapper.clientHeight;
        }
    }
    
    // Initial setup
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Set up model parameters
    const modelParams = {
        flipHorizontal: true,
        maxNumBoxes: 1,
        iouThreshold: 0.5,
        scoreThreshold: 0.7
    };
    
    // Load handtrack model
    if (typeof handTrack !== 'undefined') {
        handTrack.load(modelParams).then(loadedModel => {
            model = loadedModel;
            showMessage("Model loaded! Starting camera...");
            startVideo();
        }).catch(err => {
            console.error("Error loading model:", err);
            showMessage("Error loading AI model. Please refresh.", true);
        });
    } else {
        showMessage("Library not loaded. Please check internet connection.", true);
    }
    
    // Start webcam video
    function startVideo() {
        handTrack.startVideo(video).then(status => {
            if (status) {
                // Hide the loading overlay
                statusIndicator.style.opacity = '0';
                setTimeout(() => {
                    statusIndicator.style.display = 'none';
                }, 500);
                
                setCanvasDimensions();
                showMessage("Camera active! Raise your hand to draw.");
                detectHand();
            } else {
                showMessage("Please enable camera access.", true);
            }
        });
    }
    
    // Detect hand and draw
    function detectHand() {
        model.detect(video).then(predictions => {
            // Filter predictions
            const validPredictions = predictions.filter(p => p.score > 0.6);
            
            if (validPredictions.length > 0) {
                const pred = validPredictions[0];
                
                // Map coordinates
                // Using top-center of bounding box to approximate fingertip
                // pred.bbox = [x, y, width, height]
                
                const x = (pred.bbox[0] + pred.bbox[2] / 2) / video.width * canvas.width;
                const y = (pred.bbox[1]) / video.height * canvas.height;
                
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
        }).catch(err => {
            requestAnimationFrame(detectHand);
        });
    }
    
    // Draw line on canvas
    function drawLine(x, y) {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        
        lastX = x;
        lastY = y;
    }
    
    // Create color selection UI
    function createColorPalette() {
        if (document.querySelector('.color-palette-modal')) return;

        const palette = document.createElement('div');
        palette.className = 'color-palette-modal absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl flex gap-2 z-50 animate__animated animate__fadeInUp';
        
        colors.forEach(color => {
            const colorOption = document.createElement('div');
            colorOption.className = 'w-8 h-8 rounded-full cursor-pointer transition-transform hover:scale-110 border-2 border-white shadow-sm';
            colorOption.style.backgroundColor = color;
            
            if (color === currentColor) {
                colorOption.classList.add('ring-2', 'ring-slate-400');
            }
            
            colorOption.addEventListener('click', () => {
                currentColor = color;
                palette.remove();
                showMessage(`Color changed!`);
            });
            
            palette.appendChild(colorOption);
        });
        
        const wrapper = document.querySelector('.video-wrapper');
        wrapper.appendChild(palette);
    }
    
    // Show message
    function showMessage(text, isError = false) {
        messageDiv.textContent = text;
        if (isError) {
            messageDiv.className = 'text-center min-h-[24px] text-red-500 font-medium mb-12 animate__animated animate__fadeIn';
        } else {
            messageDiv.className = 'text-center min-h-[24px] text-rose-500 font-medium mb-12 animate__animated animate__fadeIn';
        }
    }
    
    // Event Listeners
    clearBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        showMessage("Canvas cleared!");
    });
    
    saveBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'dutgen-art.png';
        link.href = canvas.toDataURL();
        link.click();
        showMessage("Art saved!");
    });
    
    colorBtn.addEventListener('click', () => {
        const existing = document.querySelector('.color-palette-modal');
        if (existing) existing.remove();
        else createColorPalette();
    });
});