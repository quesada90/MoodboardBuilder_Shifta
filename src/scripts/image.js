// IMAGE CARDS INTERACTIONS SCRIPT
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    
    // Image interaction elements
    const zoomButtons = document.querySelectorAll('.zoom-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const deleteImageModal = document.getElementById('delete-image-modal');
    const cancelImageDelete = document.getElementById('cancel-image-delete');
    const confirmImageDelete = document.getElementById('confirm-image-delete');
    
    console.log('Zoom buttons found:', zoomButtons.length);
    console.log('Delete buttons found:', deleteButtons.length);
    
    // Track which image is being deleted
    let currentImageElement = null;
    
    // Handle zoom button clicks
    if (zoomButtons && zoomButtons.length > 0) {
        zoomButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                console.log('Zoom button clicked');
                e.stopPropagation(); // Prevent event bubbling
                
                // Get the image URL from the data attribute
                const imgSrc = this.getAttribute('data-img');
                console.log('Image source:', imgSrc);
                
                // Set the lightbox image source
                if (lightboxImage) {
                    lightboxImage.src = imgSrc;
                }
                
                // Show the lightbox
                if (lightbox) {
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent scrolling
                }
            });
        });
    }
    
    // Handle lightbox close
    if (lightboxClose) {
        lightboxClose.addEventListener('click', function() {
            console.log('Lightbox close clicked');
            closeLightbox();
        });
    }
    
    // Close lightbox when clicking outside the image
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // Handle escape key for closing lightbox
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
    
    // Function to close lightbox
    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            
            // Clear the source after animation completes
            setTimeout(() => {
                if (lightboxImage) {
                    lightboxImage.src = '';
                }
            }, 300);
        }
    }
    
    // Handle delete button clicks
    if (deleteButtons && deleteButtons.length > 0) {
        deleteButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                console.log('Delete button clicked');
                e.stopPropagation(); // Prevent event bubbling
                
                // Store reference to the current image card
                currentImageElement = this.closest('.image-card');
                
                // Show the delete confirmation modal
                if (deleteImageModal) {
                    deleteImageModal.classList.add('active');
                }
            });
        });
    }
    
    // Handle cancel delete
    if (cancelImageDelete) {
        cancelImageDelete.addEventListener('click', function() {
            console.log('Cancel delete clicked');
            // Hide the delete confirmation modal
            if (deleteImageModal) {
                deleteImageModal.classList.remove('active');
                currentImageElement = null;
            }
        });
    }
    
    // Close delete modal when clicking outside
    if (deleteImageModal) {
        deleteImageModal.addEventListener('click', function(e) {
            if (e.target === deleteImageModal) {
                deleteImageModal.classList.remove('active');
                currentImageElement = null;
            }
        });
    }
    
    // Handle confirm delete
    if (confirmImageDelete) {
        confirmImageDelete.addEventListener('click', function() {
            console.log('Confirm delete clicked');
            // Hide the delete confirmation modal
            if (deleteImageModal) {
                deleteImageModal.classList.remove('active');
            }
            
            // Remove the image
            if (currentImageElement) {
                // Get the parent grid to check how many images are left
                const imageGrid = currentImageElement.closest('.image-grid');
                
                // Remove the image with animation
                currentImageElement.style.opacity = '0';
                currentImageElement.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    // Actually remove the element
                    currentImageElement.remove();
                    currentImageElement = null;
                    
                    // Update the image counter if it exists
                    updateImageCounter(imageGrid);
                    
                    // Show the "Image deleted" notification
                    const notificationBanner = document.getElementById('notification-banner');
                    if (notificationBanner) {
                        // Update text and add specific class
                        const bannerText = notificationBanner.querySelector('p');
                        if (bannerText) {
                            bannerText.textContent = 'Image deleted';
                        }
                        notificationBanner.className = 'notification-banner'; // Reset classes
                        notificationBanner.classList.add('error-banner'); // Use error-banner for red
                        notificationBanner.classList.add('active');
                        
                        // Hide banner after 5 seconds
                        setTimeout(() => {
                            notificationBanner.classList.remove('active');
                            // Reset class after animation completes
                            setTimeout(() => {
                                notificationBanner.classList.remove('image-deleted');
                            }, 300);
                        }, 5000);
                    }
                }, 300);
            }
        });
    } else {
        console.log('Confirm delete button not found');
    }
    
    // Function to update image counter
    function updateImageCounter(imageGrid) {
        if (!imageGrid) return;
        
        // Count the remaining images
        const remainingImages = imageGrid.querySelectorAll('.image-card').length;
        console.log('Remaining images:', remainingImages);
        
        // Find and update the counter
        const imageCounter = document.querySelector('.image-counter');
        if (imageCounter) {
            const countSpan = imageCounter.querySelector('span span');
            if (countSpan) {
                countSpan.textContent = remainingImages;
            }
        }

        // Toggle empty state message visibility based on remaining images
        const emptyStateMessage = document.querySelector('.empty-state-message');
        if (emptyStateMessage) {
            emptyStateMessage.style.display = remainingImages === 0 ? 'block' : 'none';
            console.log(`Updated empty state message visibility: ${emptyStateMessage.style.display}`);
        }
    }
    
    // Add transition styles to image cards for smooth removal
    const imageCards = document.querySelectorAll('.image-card');
    if (imageCards && imageCards.length > 0) {
        imageCards.forEach(card => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        });
    }
});


// Execute immediately without waiting for DOMContentLoaded
(function() {
    // Override any display:none set in the HTML itself
    var checkAndShowEmptyState = function() {
        var emptyStateMessage = document.querySelector('.empty-state-message');
        if (!emptyStateMessage) return;
        
        // Check if we're on the new-moodboard page or creating a new moodboard
        if (window.location.pathname.indexOf('new-moodboard.html') > -1 || 
            window.location.hash === '#new') {
            
            // Force visibility - override any style attribute
            emptyStateMessage.style.display = 'block';
            emptyStateMessage.removeAttribute('hidden');
            
            // Also check the image grid
            var imageGrid = document.querySelector('.image-grid');
            if (imageGrid && imageGrid.querySelector('.image-card')) {
                // If there are images, hide the message
                emptyStateMessage.style.display = 'none';
            }
        }
    };
    
    // Run immediately
    checkAndShowEmptyState();
    
    // Also run when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        checkAndShowEmptyState();
        
        // Set up the complete empty state management
        setupEmptyStateManager();
    });
    
    // Run again after a slight delay to override any other scripts
    setTimeout(checkAndShowEmptyState, 100);
    
    // Main function for managing empty state based on image count
    function setupEmptyStateManager() {
        var imageGrid = document.querySelector('.image-grid');
        var emptyStateMessage = document.querySelector('.empty-state-message');
        
        if (!emptyStateMessage) return;
        
        // Function to check and update empty state
        function updateEmptyState() {
            if (!imageGrid) return;
            
            var hasImages = imageGrid.querySelector('.image-card') !== null;
            emptyStateMessage.style.display = hasImages ? 'none' : 'block';
            
            console.log('Empty state updated: ' + (hasImages ? 'Hidden (has images)' : 'Shown (no images)'));
        }
        
        // Update on delete confirmation
        var confirmImageDelete = document.getElementById('confirm-image-delete');
        if (confirmImageDelete) {
            confirmImageDelete.addEventListener('click', function() {
                setTimeout(updateEmptyState, 400);
            });
        }
        
        // Watch for changes to the image grid
        if (imageGrid) {
            var observer = new MutationObserver(updateEmptyState);
            observer.observe(imageGrid, { childList: true });
        }
        
        // Initial update
        updateEmptyState();
    }
})();