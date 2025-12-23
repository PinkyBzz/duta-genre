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
    
    // Affirmation messages
    const affirmationMessages = [
        "Wah, gambar yang sangat kreatif!",
        "Ekspresikan emosimu melalui karya seni.",
        "Setiap garis yang kamu buat punya makna tersendiri.",
        "Teruslah berkreasi, kamu berbakat!",
        "Seni adalah cara untuk melepaskan perasaan negatif.",
        "Indahnya berekspresi melalui gambar.",
        "Tak perlu sempurna, cukup ekspresif.",
        "Menggambar adalah terapi untuk pikiran dan hati.",
    ];
    
    // Set canvas dimensions to match video container
    function setCanvasDimensions() {
        const videoContainer = document.querySelector('.video-container');
        canvas.width = videoContainer.clientWidth;
        canvas.height = videoContainer.clientHeight;
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
    handTrack.load(modelParams).then(loadedModel => {
        model = loadedModel;
        showMessage("Model loaded successfully! Starting video...");
        startVideo();
    }).catch(err => {
        console.error("Error loading model:", err);
        showMessage("Error loading model. Please try again.", true);
    });
    
    // Start webcam video
    function startVideo() {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                video.srcObject = stream;
                video.onloadedmetadata = () => {
                    handTrack.startVideo(video).then(status => {
                        if (status) {
                            statusIndicator.classList.add('hidden');
                            showMessage("Camera activated! Move your hand to start drawing.");
                            detectHand();
                        } else {
                            showMessage("Failed to start video. Please check camera permissions.", true);
                        }
                    });
                };
            })
            .catch(err => {
                console.error("Error accessing webcam:", err);
                showMessage("Please allow camera access to use this feature.", true);
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
                const x = (hand.bbox[0] + (hand.bbox[2] / 2)) * (canvas.width / video.width);
                const y = (hand.bbox[1] + hand.bbox[3] / 3) * (canvas.height / video.height); // Use upper third for "nose" position
                
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
            console.error("Error in hand detection:", err);
            requestAnimationFrame(detectHand);
        });
    }
    
    // Draw line on canvas
    function drawLine(x, y) {
        // Create particle effect at drawing point
        createParticle(x, y);
        
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
    
    // Create particle effect
    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.classList.add('drawing-particle');
        
        // Style the particle
        particle.style.position = 'absolute';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.backgroundColor = currentColor;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '10';
        
        // Position relative to canvas
        const rect = canvas.getBoundingClientRect();
        particle.style.left = (rect.left + x) + 'px';
        particle.style.top = (rect.top + y) + 'px';
        
        // Add to DOM
        document.body.appendChild(particle);
        
        // Animate and remove
        setTimeout(() => {
            particle.style.transition = 'all 0.5s ease-out';
            particle.style.transform = 'scale(1.5)';
            particle.style.opacity = '0';
        }, 10);
        
        setTimeout(() => {
            if (particle && particle.parentNode) {
                particle.remove();
            }
        }, 500);
    }
    
    // Create color selection UI
    function createColorPalette() {
        const palette = document.createElement('div');
        palette.className = 'color-palette';
        
        colors.forEach(color => {
            const colorOption = document.createElement('div');
            colorOption.className = 'color-option';
            colorOption.style.backgroundColor = color;
            if (color === currentColor) {
                colorOption.classList.add('active');
            }
            
            colorOption.addEventListener('click', () => {
                // Remove active class from all options
                document.querySelectorAll('.color-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                
                // Add active class to selected option
                colorOption.classList.add('active');
                
                // Update current color
                currentColor = color;
                
                // Hide palette after selection
                palette.remove();
            });
            
            palette.appendChild(colorOption);
        });
        
        // Add palette to DOM
        const controls = document.querySelector('.controls');
        controls.parentNode.insertBefore(palette, controls);
        
        // Show affirmation for color change
        showMessage("Silakan pilih warna yang mencerminkan perasaanmu saat ini.");
    }
    
    // Show message with animation
    function showMessage(text, isError = false) {
        // Clear existing message
        messageDiv.innerHTML = '';
        
        // Create message box
        const messageBox = document.createElement('div');
        messageBox.className = 'message-box';
        if (isError) {
            messageBox.style.backgroundColor = 'rgba(220, 53, 69, 0.3)';
        }
        
        // Create message text
        const messageText = document.createElement('p');
        messageText.className = 'message-text';
        messageText.textContent = text;
        
        // Append to DOM
        messageBox.appendChild(messageText);
        messageDiv.appendChild(messageBox);
        
        // Show the message
        messageDiv.classList.add('active');
        
        // Hide message after delay (if not an error)
        if (!isError) {
            setTimeout(() => {
                messageDiv.classList.remove('active');
            }, 5000);
        }
    }
    
    // Show random affirmation
    function showRandomAffirmation() {
        const randomIndex = Math.floor(Math.random() * affirmationMessages.length);
        showMessage(affirmationMessages[randomIndex]);
    }
    
    // Event Listeners
    
    // Clear canvas
    clearBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        showMessage("Kanvas telah dibersihkan. Mulai menggambar lagi!");
    });
    
    // Save drawing
    saveBtn.addEventListener('click', () => {
        try {
            const dataURL = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'gambar_hidung_' + new Date().toISOString().split('T')[0] + '.png';
            link.href = dataURL;
            link.click();
            showMessage("Gambar Anda berhasil disimpan!");
        } catch (err) {
            console.error("Error saving image:", err);
            showMessage("Gagal menyimpan gambar. Silakan coba lagi.", true);
        }
    });
    
    // Change color
    colorBtn.addEventListener('click', () => {
        // Remove existing palette if any
        const existingPalette = document.querySelector('.color-palette');
        if (existingPalette) {
            existingPalette.remove();
        } else {
            createColorPalette();
        }
    });
    
    // Show initial affirmation after a delay
    setTimeout(() => {
        showRandomAffirmation();
    }, 5000);
    
    // Show a new affirmation periodically
    setInterval(showRandomAffirmation, 20000);
});
