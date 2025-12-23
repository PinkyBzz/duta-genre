/**
 * DutGen - Aplikasi untuk merekam suasana hati dan emosi harian
 * 
 * dutgen.js - File JavaScript utama untuk animasi dan interaksi
 * @version 1.2.0
 * @author DutGen Team
 */

"use strict";

/**
 * Main application namespace
 */
const DutGen = {
    /**
     * Configuration settings
     */
    config: {
        starCount: 15,              // Number of stars to create
        starDuration: 2500,         // Duration for star animation (ms)
        thoughtDuration: 3000,      // Duration for thought animation (ms)
        notificationDuration: 3000, // Duration for notifications (ms)
        animationDelay: 50,         // Delay for sequential animations (ms)
    },
    
    /**
     * Application elements
     */
    elements: {},
    
    /**
     * Initialize the application
     */    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.setupAnimations();
        this.setupStarCanvas();
        this.initializeBackgroundColor();
    },
    
    /**
     * Initialize the background color
     */
    initializeBackgroundColor() {
        if (this.elements.bgColorPicker) {
            // Set initial background color from color picker value
            document.body.style.backgroundColor = this.elements.bgColorPicker.value;
            document.documentElement.style.setProperty('--bg-color', this.elements.bgColorPicker.value);
        }
    },
    
    /**
     * Cache DOM elements for better performance
     */
    cacheElements() {
        this.elements = {
            inputField: document.querySelector('.thought-input'),
            container: document.body,
            bgColorPicker: document.getElementById('bgColorPicker'),
            boxes: document.querySelectorAll('.box'),
            starCanvas: document.getElementById('starCanvas'),
            notificationContainer: document.getElementById('notification'),
        };
    },
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Background color change
        if (this.elements.bgColorPicker) {
            this.elements.bgColorPicker.addEventListener('input', this.handleBackgroundColorChange.bind(this));
        }
        
        // Thought submission
        if (this.elements.inputField) {
            this.elements.inputField.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    this.handleThoughtSubmission();
                }
            });
        }
    },
    
    /**
     * Set up animations
     */
    setupAnimations() {
        // Box appear animations
        this.elements.boxes.forEach((box, index) => {
            box.style.setProperty('--order', index);
        });
    },
    
    /**
     * Set up canvas for star animations
     */
    setupStarCanvas() {
        if (!this.elements.starCanvas) return;
        
        const canvas = this.elements.starCanvas;
        const ctx = canvas.getContext('2d');
        
        // Resize canvas to full window
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Store canvas context for later use
        this.ctx = ctx;
    },
      /**
     * Handle background color change
     */
    handleBackgroundColorChange() {
        // Set the background color directly without animation
        document.body.style.backgroundColor = this.elements.bgColorPicker.value;
        
        // Update CSS variable for any other elements that might use it
        document.documentElement.style.setProperty('--bg-color', this.elements.bgColorPicker.value);
    },
    
    /**
     * Handle thought submission
     */
    handleThoughtSubmission() {
        const thoughtText = this.elements.inputField.value.trim();
        
        if (!thoughtText) {
            this.showNotification('Silakan tulis pikiranmu terlebih dahulu...', null, 'warning');
            return;
        }
        
        this.animateThoughts(thoughtText);
        this.createStars(this.config.starCount);
        this.elements.inputField.value = ''; // Clear input
        
        // Save to local storage for history (optional feature)
        this.saveThought(thoughtText);
        
        // Show notification
        this.showNotification('Pikiranmu telah dilepaskan ke langit...', null, 'success');
    },
    
    /**
     * Save thought to local storage (for potential history feature)
     * @param {string} thought - The thought text to save
     */
    saveThought(thought) {
        try {
            const thoughts = JSON.parse(localStorage.getItem('dutgen_thoughts') || '[]');
            thoughts.push({
                text: thought,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('dutgen_thoughts', JSON.stringify(thoughts.slice(-20))); // Keep last 20
        } catch (error) {
            console.warn('Failed to save thought to local storage:', error);
        }
    },
    
    /**
     * Create stars for animation
     * @param {number} count - Number of stars to create
     */
    createStars(count) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.createStar();
            }, i * 100);
        }
    },
    
    /**
     * Create a single star and animate it
     */
    createStar() {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random size between 3 and 8px
        const size = 3 + Math.random() * 5;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Generate a dynamic color for variety
        const hue = 210 + Math.random() * 50; // Blue-ish
        const saturation = 70 + Math.random() * 30;
        const lightness = 70 + Math.random() * 30;
        star.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        star.style.boxShadow = `0 0 ${size * 2}px 1px hsl(${hue}, ${saturation}%, ${lightness}%)`;
        
        // Position random from center bottom area
        const viewportWidth = window.innerWidth;
        const centerX = viewportWidth / 2;
        const spreadX = viewportWidth * 0.3; // 30% of screen width
        
        star.style.left = `${centerX - spreadX/2 + Math.random() * spreadX}px`;
        star.style.bottom = '50px';
        this.elements.container.appendChild(star);

        // Animate the star
        setTimeout(() => {
            const rotation = Math.random() * 360;
            const xOffset = (Math.random() - 0.5) * 200; // -100px to 100px
            
            star.style.transition = `transform ${this.config.starDuration/1000}s cubic-bezier(0.25, 0.1, 0.25, 1), opacity ${this.config.starDuration/1000 - 0.2}s ease-out`;
            star.style.transform = `translateY(-${window.innerHeight}px) translateX(${xOffset}px) rotate(${rotation}deg)`;
            star.style.opacity = '0';
        }, 10);

        // Remove the star after animation
        setTimeout(() => {
            star.remove();
        }, this.config.starDuration);
    },

    /**
     * Animate thoughts floating up
     * @param {string} thoughtText - Text of the thought to animate
     */
    animateThoughts(thoughtText) {
        if (!thoughtText) return;
        
        const thought = document.createElement('div');
        thought.className = 'thought';
        thought.innerText = thoughtText;
        thought.style.left = '50%';
        thought.style.bottom = '100px';
        thought.style.transform = 'translateX(-50%)';
        thought.style.fontSize = '28px';
        thought.style.opacity = '1';
        this.elements.container.appendChild(thought);

        // Animate the thought - fading and shrinking
        let size = 28;
        const interval = setInterval(() => {
            size -= 0.3;
            thought.style.fontSize = size + 'px';
            thought.style.opacity = (size / 28).toFixed(2);

            if (size <= 0 || thought.style.opacity <= 0) {
                clearInterval(interval);
                thought.remove();
            }
        }, this.config.animationDelay);

        // Move the thought upward with slight randomness
        const xOffset = (Math.random() - 0.5) * 100; // -50px to 50px
        thought.style.transition = `transform ${this.config.thoughtDuration/1000}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
        thought.style.transform = `translate(calc(-50% + ${xOffset}px), -100vh) rotate(${Math.random() * 10 - 5}deg)`;
    },
    
    /**
     * Show notification
     * @param {string} message - Message to display
     * @param {number} duration - Duration in ms (null for default)
     * @param {string} type - Type of notification ('info', 'success', 'warning')
     */
    showNotification(message, duration = null, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.classList.add(type);
        notification.textContent = message;
        
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());
        
        document.body.appendChild(notification);
        
        // Show the notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Hide the notification after duration
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration || this.config.notificationDuration);
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    DutGen.init();
});
