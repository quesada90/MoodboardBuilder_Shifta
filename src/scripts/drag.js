// Straightforward drag and drop implementation
document.addEventListener('DOMContentLoaded', function() {
    const imageGrid = document.querySelector('.image-grid');
    let dragged = null;
    
    // Initialize HTML5 Drag and Drop
    function initDraggable() {
        const imageCards = document.querySelectorAll('.image-card');
        
        imageCards.forEach(card => {
            // Enable dragging
            card.setAttribute('draggable', true);
            
            // Add the basic drag events
            card.addEventListener('dragstart', handleDragStart);
            card.addEventListener('dragend', handleDragEnd);

            // Set cursor style for draggable items
            card.style.cursor = 'grab';
        });
        
        // Add drop zone handlers to the grid
        if (imageGrid) {
            imageGrid.addEventListener('dragover', handleDragOver);
            imageGrid.addEventListener('drop', handleDrop);
        }
    }
    
    // When starting to drag
    function handleDragStart(e) {
        dragged = this;
        
        // Change cursor to grabbing
        this.style.cursor = 'grabbing';

        // Set the drag image (default behavior)
        e.dataTransfer.setData('text/plain', ''); // Required for Firefox
        
        // Add dragging class for styling
        setTimeout(() => {
            this.classList.add('dragging');
            
            // Apply tilt effect based on cursor position
            const rect = this.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const tiltAmount = ((e.clientX - centerX) / rect.width) * 10; // -5 to +5 degrees
            
            this.style.transform = `rotate(${tiltAmount}deg) scale(0.95)`;
            this.style.boxShadow = '0px 30px 30px rgba(0, 0, 0, 0.5)';
            this.style.opacity = '0.9';
            
            // Hide the original element
            this.style.visibility = 'hidden';
        }, 0);
    }
    
    // When dragging over a potential drop zone
    function handleDragOver(e) {
        e.preventDefault(); // Allow dropping
        
        if (!dragged) return;
        
        // Find the element we're directly over
        let targetCard = getCardUnderCursor(e);
        
        if (targetCard && targetCard !== dragged) {
            // Calculate whether we're on the left or right half of the target
            const rect = targetCard.getBoundingClientRect();
            const beforeTarget = e.clientX < rect.left + rect.width / 2;
            
            // Move the placeholder to show where the card will go
            if (beforeTarget) {
                // Add the placeholder before the target
                if (targetCard.previousElementSibling !== dragged) {
                    imageGrid.insertBefore(dragged, targetCard);
                }
            } else {
                // Add the placeholder after the target
                if (targetCard.nextElementSibling) {
                    if (targetCard.nextElementSibling !== dragged) {
                        imageGrid.insertBefore(dragged, targetCard.nextElementSibling);
                    }
                } else {
                    imageGrid.appendChild(dragged);
                }
            }
        }
    }
    
    // Helper to get the card under the cursor
    function getCardUnderCursor(e) {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        return el ? el.closest('.image-card') : null;
    }
    
    // When dropping the element
    function handleDrop(e) {
        e.preventDefault();
        
        if (!dragged) return;
        
        // Make the dragged element visible again
        dragged.style.visibility = 'visible';
        
        // Remove all styling
        dragged.classList.remove('dragging');
        dragged.style.transform = '';
        dragged.style.boxShadow = '';
        dragged.style.opacity = '';
        
        dragged = null;
    }
    
    // When ending the drag (happens after drop)
    function handleDragEnd() {
        if (!this.classList.contains('dragging')) return;
        this.style.cursor = 'grab';
        
        // Make sure we're visible
        this.style.visibility = 'visible';
        
        // Remove all styling
        this.classList.remove('dragging');
        this.style.transform = '';
        this.style.boxShadow = '';
        this.style.opacity = '';
    }
    
    // Initialize the drag and drop
    if (imageGrid) {
        // Initialize on load
        window.addEventListener('load', initDraggable);
        
        // Add global function for new images
        window.initNewDraggableImages = function() {
            const newCards = document.querySelectorAll('.image-card:not([draggable])');
            newCards.forEach(card => {
                card.setAttribute('draggable', true);
                card.addEventListener('dragstart', handleDragStart);
                card.addEventListener('dragend', handleDragEnd);
            });
        };
        
        // Observer for new images
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    setTimeout(window.initNewDraggableImages, 100);
                }
            });
        });
        
        observer.observe(imageGrid, { childList: true });
        
        // Initialize immediately
        initDraggable();
    }
});