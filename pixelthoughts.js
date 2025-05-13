document.addEventListener('DOMContentLoaded', function() {
    const container = document.body;
    const submitButton = document.getElementById('submitThought');

    console.log("DOM fully loaded and parsed for snow animation");

    // Function to create a snowflake
    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.style.position = 'absolute';
        const size = Math.random() * 10 + 5; // Random size between 5px and 15px
        snowflake.style.width = size + 'px';
        snowflake.style.height = size + 'px';
        snowflake.style.backgroundColor = 'white';
        snowflake.style.borderRadius = '50%';
        snowflake.style.left = Math.random() * window.innerWidth + 'px';
        snowflake.style.bottom = '0px';
        container.appendChild(snowflake);

        // Animate the snowflake upwards
        const duration = Math.random() * 3 + 2; // Random duration between 2s and 5s
        const horizontalMovement = Math.random() * 100 - 50; // Random horizontal movement
        setTimeout(() => {
            snowflake.style.transition = `transform ${duration}s linear, opacity ${duration}s linear`;
            snowflake.style.transform = `translate(${horizontalMovement}px, -${window.innerHeight}px)`; // Move upwards
            snowflake.style.opacity = '0'; // Fade out
        }, 10);

        // Remove the snowflake after animation
        setTimeout(() => {
            snowflake.remove();
        }, duration * 1000);
    }

    // Create snowflakes at intervals
    setInterval(createSnowflake, 300); // Create a snowflake every 300ms

    // Function to animate thoughts
    function animateThoughts() {
        const thoughtText = document.querySelector('.thought-input').value;
        console.log("Thought submitted: ", thoughtText);
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
            thought.style.transition = 'transform 2s linear, opacity 2s linear, font-size 2s linear';
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
            thought.style.transform = 'translate(-50%, -100vh)';

            // Apply fade-out effect
            setTimeout(() => {
                thought.classList.add('fade-out');
            }, 1000); // Start fading out after 1 second
        } else {
            console.log("No thought to submit");
        }
    }

    // Event listener for input submission
    submitButton.addEventListener('click', function() {
        // Trigger thought animation and star creation
        animateThoughts();
        for (let i = 0; i < 5; i++) { // Reduced to 5 stars
            createSnowflake();
        }
        document.querySelector('.thought-input').value = ''; // Clear input
    });

});
