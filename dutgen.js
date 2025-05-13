document.addEventListener('DOMContentLoaded', function() {
    const inputField = document.querySelector('.thought-input');
    const container = document.body;
    const bgColorPicker = document.getElementById('bgColorPicker');

    // Event listener for background color change
    bgColorPicker.addEventListener('input', function() {
        document.documentElement.style.setProperty('--blink-color', bgColorPicker.value);
    });

    // Function to create a star
    function createStar() {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.position = 'absolute';
        star.style.width = '5px';
        star.style.height = '5px';
        star.style.backgroundColor = 'white';
        star.style.borderRadius = '50%';
        star.style.left = Math.random() * window.innerWidth + 'px';
        star.style.bottom = '0px';
        container.appendChild(star);

        // Animate the star
        setTimeout(() => {
            star.style.transition = 'transform 2s linear';
            star.style.transform = 'translateY(-100vh)';
        }, 10);

        // Remove the star after animation
        setTimeout(() => {
            star.remove();
        }, 2000);
    }

    // Function to animate thoughts
    function animateThoughts() {
        const thoughtText = inputField.value;
        if (thoughtText) {
            const thought = document.createElement('div');
            thought.className = 'thought';
            thought.innerText = thoughtText;
            thought.style.position = 'absolute';
            thought.style.left = '50%';
            thought.style.transform = 'translateX(-50%)';
            thought.style.fontSize = '24px';
            thought.style.opacity = '1';
            container.appendChild(thought);

            // Animate the thought
            let size = 24;
            const interval = setInterval(() => {
                size -= 0.5;
                thought.style.fontSize = size + 'px';
                thought.style.opacity -= 0.02;

                if (size <= 0 || thought.style.opacity <= 0) {
                    clearInterval(interval);
                    thought.remove();
                }
            }, 50);

            // Move the thought upward
            thought.style.transition = 'transform 2s linear';
            thought.style.transform = 'translate(-50%, -100vh)';
        }
    }

    // Event listener for input submission
    inputField.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            animateThoughts();
            for (let i = 0; i < 10; i++) {
                createStar();
            }
            inputField.value = ''; // Clear input
        }
    });
});
