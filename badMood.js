document.addEventListener('DOMContentLoaded', function() {
    const mainHeading = document.querySelector('.main-heading');
    const cardContainer = document.querySelector('.card-container');

    if (mainHeading) {
        mainHeading.classList.add('slide-up');
    }
    if (cardContainer) {
        cardContainer.classList.add('slide-up');
    }
});
