document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const video = document.getElementById('webcam');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const statusIndicator = document.getElementById('status');
    const messageDiv = document.getElementById('message');
    const videoWrapper = document.getElementById('videoWrapper');
    
    // Buttons
    const clearBtn = document.getElementById('clearBtn');
    const saveBtn = document.getElementById('saveBtn');
    const colorBtn = document.getElementById('colorBtn');
    const modeTouchBtn = document.getElementById('modeTouch');
    const modeCameraBtn = document.getElementById('modeCamera');
    
    // State
    let currentMode = 'touch'; // 'touch' or 'camera'
    let model = null;
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let currentColor = '#000000'; // Default black for white canvas
    let lineWidth = 5;
    let isVideoRunning = false;
    
    // Colors
    const colors = ['#000000', '#FF5252', '#FFEB3B', '#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#E91E63'];
    
    // --- Initialization ---
    
    function init() {
        setCanvasDimensions();
        window.addEventListener('resize', setCanvasDimensions);
        
        // Default to Touch Mode
        setMode('touch');
    }
    
    function setCanvasDimensions() {
        if (videoWrapper) {
            // Save current content
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(canvas, 0, 0);
            
            // Resize
            canvas.width = videoWrapper.clientWidth;
            canvas.height = videoWrapper.clientHeight;
            
            // Restore content (scaled)
            ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
            
            // Reset context props
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        }
    }
    
    // --- Mode Switching ---
    
    function setMode(mode) {
        currentMode = mode;
        
        if (mode === 'touch') {
            // UI Updates
            modeTouchBtn.className = 'px-4 py-2 rounded-lg text-sm font-medium transition-all bg-white text-slate-800 shadow-sm';
            modeCameraBtn.className = 'px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 transition-all';
            
            // Canvas/Video Updates
            videoWrapper.classList.remove('camera-mode');
            video.classList.add('hidden');
            statusIndicator.classList.add('hidden');
            canvas.style.transform = 'none'; // No mirror for touch
            
            // Stop Video if running
            if (isVideoRunning) {
                handTrack.stopVideo(video);
                isVideoRunning = false;
            }
            
            // Reset Color to Black (better for white bg)
            currentColor = '#000000';
            showMessage("Touch Mode: Draw with your mouse or finger.");
            
        } else {
            // UI Updates
            modeCameraBtn.className = 'px-4 py-2 rounded-lg text-sm font-medium transition-all bg-white text-slate-800 shadow-sm';
            modeTouchBtn.className = 'px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 transition-all';
            
            // Canvas/Video Updates
            videoWrapper.classList.add('camera-mode');
            video.classList.remove('hidden');
            statusIndicator.classList.remove('hidden');
            canvas.style.transform = 'scaleX(-1)'; // Mirror for camera
            
            // Reset Color to White (better for video bg)
            currentColor = '#FFFFFF';
            
            // Start Video
            startCameraLogic();
        }
    }
    
    modeTouchBtn.addEventListener('click', () => setMode('touch'));
    modeCameraBtn.addEventListener('click', () => setMode('camera'));
    
    // --- Touch/Mouse Logic ---
    
    function getCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;
        
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('touchmove', draw, { passive: false });
    
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    canvas.addEventListener('touchend', stopDrawing);
    
    function startDrawing(e) {
        if (currentMode !== 'touch') return;
        if (e.type === 'touchstart') e.preventDefault();
        
        isDrawing = true;
        const coords = getCoordinates(e);
        lastX = coords.x;
        lastY = coords.y;
    }
    
    function draw(e) {
        if (currentMode !== 'touch' || !isDrawing) return;
        if (e.type === 'touchmove') e.preventDefault();
        
        const coords = getCoordinates(e);
        drawLine(coords.x, coords.y);
    }
    
    function stopDrawing() {
        isDrawing = false;
    }
    
    // --- Camera Logic ---
    
    const modelParams = {
        flipHorizontal: true,
        maxNumBoxes: 1,
        iouThreshold: 0.5,
        scoreThreshold: 0.7
    };
    
    function startCameraLogic() {
        if (typeof handTrack === 'undefined') {
            showMessage("Library not loaded.", true);
            return;
        }
        
        if (!model) {
            handTrack.load(modelParams).then(loadedModel => {
                model = loadedModel;
                startVideo();
            });
        } else {
            startVideo();
        }
    }
    
    function startVideo() {
        handTrack.startVideo(video).then(status => {
            if (status) {
                isVideoRunning = true;
                statusIndicator.style.display = 'none';
                setCanvasDimensions();
                showMessage("Camera active! Raise your hand to draw.");
                detectHand();
            } else {
                showMessage("Please enable camera access.", true);
            }
        });
    }
    
    function detectHand() {
        if (currentMode !== 'camera' || !isVideoRunning) return;
        
        model.detect(video).then(predictions => {
            const validPredictions = predictions.filter(p => p.score > 0.6);
            
            if (validPredictions.length > 0) {
                const pred = validPredictions[0];
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
        });
    }
    
    // --- Shared Drawing Logic ---
    
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
    
    // --- UI Helpers ---
    
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
        
        videoWrapper.appendChild(palette);
    }
    
    function showMessage(text, isError = false) {
        messageDiv.textContent = text;
        messageDiv.className = isError 
            ? 'text-center min-h-[24px] text-red-500 font-medium mb-12 animate__animated animate__fadeIn'
            : 'text-center min-h-[24px] text-rose-500 font-medium mb-12 animate__animated animate__fadeIn';
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
    
    // Start
    init();
});