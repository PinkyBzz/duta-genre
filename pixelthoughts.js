document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const container = document.body;
    const thoughtInput = document.getElementById('thoughtInput');
    const submitButton = document.getElementById('submitThoughts');
    const thoughtsDisplay = document.getElementById('thoughtsDisplay');
    const calmingResponse = document.getElementById('calmingResponse');
    const timerDisplay = document.getElementById('timer');
    const startButton = document.getElementById('startTimer');
    const resetButton = document.getElementById('resetTimer');
    const toggleAudioButton = document.getElementById('toggleAudio');
    const audioIcon = document.getElementById('audioIcon');
    const backgroundAudio = document.getElementById('backgroundAudio');
    
    // Variables
    let timerInterval;
    let seconds = 0;
    let isPlaying = false;

    console.log("Pixel Thoughts app initialized");
    
    // Affirmation Messages - Extended list with more personalized options
    const affirmationMessages = [
        "Tarik nafas dalam-dalam, lepaskan pikiran negatif itu.",
        "Kamu tidak sendirian; tidak apa-apa merasa seperti ini.",
        "Fokus pada saat ini; semuanya akan baik-baik saja.",
        "Hirup kedamaian, hembuskan ketegangan.",
        "Kamu lebih kuat dari yang kamu pikirkan.",
        "Ini hanya sementara dan akan berlalu.",
        "Kamu dicintai dan didukung.",
        "Kamu sudah melakukan yang terbaik, dan itu sudah cukup.",
        "Luangkan waktu untuk merawat diri sendiri.",
        "Kamu bukan sekedar pikiranmu; kamu jauh lebih dari itu.",
        "Setiap langkah kecil adalah kemajuan yang berarti.",
        "Kamu berharga dan pantas bahagia.",
        "Lepaskan apa yang tidak bisa kamu kendalikan.",
        "Percaya pada kekuatanmu untuk melewati ini.",
        "Pikiran ini hanya lewat, bukan bagian dari dirimu.",
        "Kamu tetap bersinar bahkan di hari-hari tersulit.",
        "Bersikap lembut pada dirimu hari ini.",
        "Tantangan ini membuatmu lebih kuat.",
        "Kamu membawa cahaya ke dunia dengan caramu sendiri.",
        "Setiap hari adalah kesempatan baru untuk memulai.",
    ];
    
    // Function to create a snowflake/particle
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'snowflake';
        
        // Random properties for varied appearance
        const size = Math.random() * 8 + 4; // Size between 4px and 12px
        const opacity = Math.random() * 0.6 + 0.2; // Opacity between 0.2 and 0.8
        
        // Apply styles
        particle.style.position = 'absolute';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.backgroundColor = 'white';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.bottom = '0px';
        particle.style.opacity = opacity;
        
        container.appendChild(particle);

        // Animate the particle upwards with some randomness
        const duration = Math.random() * 4 + 3; // Duration between 3s and 7s
        const horizontalMovement = Math.random() * 200 - 100; // Random horizontal movement between -100px and 100px
        
        setTimeout(() => {
            particle.style.transition = `transform ${duration}s ease-out, opacity ${duration}s linear`;
            particle.style.transform = `translate(${horizontalMovement}px, -${window.innerHeight + 100}px)`;
            particle.style.opacity = '0';
        }, 10);

        // Remove the particle after animation completes
        setTimeout(() => {
            if (particle && particle.parentNode) {
                particle.remove();
            }
        }, duration * 1000);
    }

    // Create background particles at intervals
    const particleInterval = setInterval(createParticle, 500);
    
    // Function to show an affirmation message with enhanced animation
    function showAffirmationMessage(thoughtText) {
        // Clear previous message first
        calmingResponse.innerHTML = '';
        
        // Select random affirmation message
        const randomIndex = Math.floor(Math.random() * affirmationMessages.length);
        const affirmation = affirmationMessages[randomIndex];
        
        // Create message container with styling
        const messageContainer = document.createElement('div');
        messageContainer.className = 'affirmation-container';
        
        // Create personalized intro if there's a thought
        if (thoughtText && thoughtText.trim().length > 0) {
            const personalIntro = document.createElement('p');
            personalIntro.className = 'personal-intro';
            personalIntro.textContent = `Untuk pikiran "${thoughtText}":`;
            messageContainer.appendChild(personalIntro);
        }
        
        // Create affirmation text
        const affirmationText = document.createElement('p');
        affirmationText.className = 'affirmation-text';
        affirmationText.textContent = affirmation;
        messageContainer.appendChild(affirmationText);
        
        // Add to DOM
        calmingResponse.appendChild(messageContainer);
        
        // Initial state - invisible
        calmingResponse.style.opacity = '0';
        
        // Force reflow to ensure animation works
        void calmingResponse.offsetWidth;
        
        // Add active class to trigger animation
        calmingResponse.classList.add('active');
        
        // Create particles around the affirmation for visual emphasis
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                createSpecialParticle(calmingResponse);
            }, i * 200);
        }
        
        // Keep message visible longer but eventually fade it
        setTimeout(() => {
            calmingResponse.classList.remove('active');
        }, 12000);
    }
    
    // Function to create special particles around affirmation box
    function createSpecialParticle(element) {
        if (!element) return;
        
        const rect = element.getBoundingClientRect();
        const particle = document.createElement('div');
        particle.className = 'special-particle';
        
        // Position around the affirmation box
        const posX = rect.left + Math.random() * rect.width;
        const posY = rect.top + Math.random() * rect.height;
        
        particle.style.position = 'absolute';
        particle.style.width = '6px';
        particle.style.height = '6px';
        particle.style.backgroundColor = '#ffffff';
        particle.style.borderRadius = '50%';
        particle.style.left = posX + 'px';
        particle.style.top = posY + 'px';
        particle.style.opacity = '0.8';
        particle.style.boxShadow = '0 0 5px #ffffff';
        
        container.appendChild(particle);
        
        // Animate the particle outward
        setTimeout(() => {
            particle.style.transition = 'all 2s ease-out';
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 50;
            particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
            particle.style.opacity = '0';
        }, 10);
        
        // Remove after animation
        setTimeout(() => {
            if (particle && particle.parentNode) {
                particle.remove();
            }
        }, 2000);
    }
    
    // Function to animate thoughts
    function animateThought(text) {
        if (!text) return;
        
        // Create thought element
        const thought = document.createElement('div');
        thought.className = 'thought';
        thought.textContent = text;
        thought.style.position = 'absolute';
        thought.style.left = '50%';
        thought.style.top = '60%';
        thought.style.transform = 'translate(-50%, -50%)';
        thought.style.fontSize = '24px';
        thought.style.opacity = '1';
        container.appendChild(thought);

        // Animate the thought
        setTimeout(() => {
            thought.style.transition = `transform 3s ease-out, opacity 3s linear, font-size 3s linear`;
            thought.style.transform = 'translate(-50%, -100vh) scale(0.5)';
            thought.style.opacity = '0';
        }, 10);

        // Remove the thought after animation
        setTimeout(() => {
            if (thought && thought.parentNode) {
                thought.remove();
            }
        }, 3000);
        
        // Create multiple particles for visual effect
        for (let i = 0; i < 15; i++) {
            setTimeout(createParticle, i * 100);
        }
    }
    
    // Event Listeners
    
    // Submit thought
    submitButton.addEventListener('click', () => {
        const thoughtText = thoughtInput.value.trim();
        
        if (thoughtText) {
            // Add to display area
            const thoughtElement = document.createElement('p');
            thoughtElement.textContent = thoughtText;
            thoughtsDisplay.appendChild(thoughtElement);
            
            // Animate the thought
            animateThought(thoughtText);
            
            // Show affirmation message with the thought text for personalization
            showAffirmationMessage(thoughtText);
            
            // Clear input
            thoughtInput.value = '';
        }
    });
    
    // Enter key submits thought
    thoughtInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitButton.click();
        }
    });
    
    // Timer controls
    startButton.addEventListener('click', () => {
        clearInterval(timerInterval);
        
        timerInterval = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const displaySeconds = seconds % 60;
            timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(displaySeconds).padStart(2, '0')}`;
        }, 1000);
        
        startButton.textContent = 'Pause Timer';
        startButton.classList.add('active');
    });
    
    resetButton.addEventListener('click', () => {
        clearInterval(timerInterval);
        seconds = 0;
        timerDisplay.textContent = '00:00';
        startButton.textContent = 'Start Timer';
        startButton.classList.remove('active');
    });
    
    // Audio control
    toggleAudioButton.addEventListener('click', () => {
        if (isPlaying) {
            backgroundAudio.pause();
            audioIcon.className = 'fas fa-play';
        } else {
            backgroundAudio.play();
            audioIcon.className = 'fas fa-pause';
        }
        isPlaying = !isPlaying;
    });
    
    // Create initial set of particles
    for (let i = 0; i < 20; i++) {
        setTimeout(createParticle, i * 200);
    }
});
