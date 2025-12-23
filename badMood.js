document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const mainHeading = document.querySelector('.main-heading');
    const cardContainer = document.querySelector('.card-container');
    const cards = document.querySelectorAll('.card');
    const navButtons = document.querySelector('.navigation-buttons');
    
    // Apply entrance animations with delay
    if (mainHeading) {
        mainHeading.classList.add('slide-up');
    }
    
    if (cardContainer) {
        setTimeout(() => {
            cardContainer.classList.add('slide-up');
        }, 300);
    }
    
    // Add staggered animation to cards
    if (cards.length > 0) {
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = "0";
                card.style.animation = `fadeIn 0.6s ease-out forwards ${index * 0.2}s`;
            }, 500);
        });
    }
    
    // Add fade-in animation to navigation buttons
    if (navButtons) {
        navButtons.style.opacity = "0";
        setTimeout(() => {
            navButtons.style.animation = "fadeIn 0.8s ease-out forwards";
        }, 1200);
    }
    
    // Add hover effects to cards
    cards.forEach(card => {
        card.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.3)';
        });
        
        card.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        });
    });
});
