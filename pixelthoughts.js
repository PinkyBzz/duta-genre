document.addEventListener('DOMContentLoaded', () => {
    const starContainer = document.getElementById('star-container');
    const input = document.getElementById('thought-input');
    const doneBtn = document.getElementById('done-btn');
    const guidance = document.getElementById('guidance');
    const audio = document.getElementById('bg-music');
    const audioBtn = document.getElementById('toggle-audio');
    const audioIcon = document.getElementById('audio-icon');
    const starsContainer = document.getElementById('stars-container');

    let isProcessing = false;

    // --- Generate Stars ---
    function generateStars() {
        const count = 200;
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'star-dot';
            
            // Random position
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            // Random size
            const size = Math.random() * 2 + 1;
            
            // Random animation props
            const duration = Math.random() * 3 + 2; // 2-5s
            const delay = Math.random() * 5;

            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.setProperty('--duration', `${duration}s`);
            star.style.setProperty('--delay', `${delay}s`);

            starsContainer.appendChild(star);
        }
    }
    generateStars();

    // Show "Done" button when typing
    input.addEventListener('input', () => {
        if (input.value.trim().length > 0) {
            doneBtn.classList.add('visible');
        } else {
            doneBtn.classList.remove('visible');
        }
    });

    // Audio Toggle
    audioBtn.addEventListener('click', () => {
        // Re-query the icon because Iconify might have replaced the DOM element
        const currentIcon = document.getElementById('audio-icon');
        const btnText = audioBtn.querySelector('.text-sm');

        if (audio.paused) {
            audio.play().then(() => {
                // Update Icon
                if (currentIcon) currentIcon.setAttribute('data-icon', 'lucide:pause');
                // Update Text
                if (btnText) btnText.textContent = "Pause";
                // Add active style
                audioBtn.classList.add('active-audio');
            }).catch(error => {
                console.error("Audio play failed:", error);
                alert("Maaf, musik tidak dapat diputar. Silakan cek koneksi internet Anda.");
            });
        } else {
            audio.pause();
            // Update Icon
            if (currentIcon) currentIcon.setAttribute('data-icon', 'lucide:play');
            // Update Text
            if (btnText) btnText.textContent = "Music";
            // Remove active style
            audioBtn.classList.remove('active-audio');
        }
    });

    // Main Logic
    doneBtn.addEventListener('click', startProcess);

    function startProcess() {
        if (isProcessing) return;
        isProcessing = true;

        // 1. UI Changes
        doneBtn.classList.remove('visible');
        input.disabled = true;
        
        // Auto play music if not playing
        if (audio.paused) {
            audio.play().catch(e => console.log("Audio autoplay blocked"));
            audioIcon.setAttribute('data-icon', 'lucide:pause');
        }

        // 2. Start Animation (Shrink Star)
        // Scale down to 0 over 60 seconds
        starContainer.style.transform = 'translate(-50%, -50%) scale(0.01)';
        starContainer.style.opacity = '0';

        // 3. Guidance Sequence
        const messages = [
            { time: 0, text: "Take a deep breath..." },
            { time: 5000, text: "Relax your shoulders..." },
            { time: 10000, text: "Life is much bigger than this thought." },
            { time: 20000, text: "Look at how small this thought is becoming." },
            { time: 30000, text: "In the grand scheme of the universe..." },
            { time: 40000, text: "This thought is just a tiny speck." },
            { time: 50000, text: "Let it drift away into the void." },
            { time: 58000, text: "It's gone now." }
        ];

        messages.forEach(msg => {
            setTimeout(() => {
                showGuidance(msg.text);
            }, msg.time);
        });

        // 4. Finish
        setTimeout(() => {
            showGuidance("You are free.");
            setTimeout(() => {
                location.reload(); // Reset for new thought
            }, 4000);
        }, 62000);
    }

    function showGuidance(text) {
        guidance.style.opacity = '0';
        setTimeout(() => {
            guidance.textContent = text;
            guidance.style.opacity = '1';
        }, 1000);
    }
});