document.addEventListener('DOMContentLoaded', function() {

    // Initialize empty state message visibility based on image count
    function initializeEmptyStateMessage() {
        const imageGrid = document.querySelector('.image-grid');
        const emptyStateMessage = document.querySelector('.empty-state-message');
        
        if (imageGrid && emptyStateMessage) {
            const imageCount = imageGrid.querySelectorAll('.image-card').length;
            emptyStateMessage.style.display = imageCount === 0 ? 'block' : 'none';
            console.log(`Initial image count: ${imageCount}, Empty state visibility: ${emptyStateMessage.style.display}`);
        }
    }
    
    // Call the initialization function
    initializeEmptyStateMessage();

    // Get the upload box elements
    const uploadBox = document.querySelector('.upload-box');
    const uploadIcon = uploadBox ? uploadBox.querySelector('i') : null;
    const uploadText = uploadBox ? uploadBox.querySelector('.upload-text') : null;

    // Exit if the upload box doesn't exist on this page
    if (!uploadBox || !uploadIcon || !uploadText) return;

    // Original text and class values to restore after interactions
    const originalText = uploadText.textContent;
    const originalIconClass = uploadIcon.className;
    
    // Click handler to open file browser
    uploadBox.addEventListener('click', function(e) {
        // Create a file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.accept = 'image/*';
        
        // Trigger click on the file input
        fileInput.click();
        
        // Handle file selection
        fileInput.addEventListener('change', function(e) {
            if (this.files.length > 0) {
                handleFiles(this.files);
            }
        });
    });
    
    // Drag enter event
    uploadBox.addEventListener('dragenter', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Only apply effects if files are being dragged
        if (containsFiles(e)) {
            applyDragEffects();
        }
    });
    
    // Drag over event
    uploadBox.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Only apply effects if files are being dragged
        if (containsFiles(e)) {
            applyDragEffects();
        }
    });
    
    // Drag leave event
    uploadBox.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Only remove effects if not entering a child element
        if (!uploadBox.contains(e.relatedTarget)) {
            removeDragEffects();
        }
    });
    
    // Drop event
    uploadBox.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Remove the drag effects
        removeDragEffects();
        
        // Process the dropped files if any
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });
    
    // Check if the drag event contains files
    function containsFiles(e) {
        if (e.dataTransfer && e.dataTransfer.types) {
            for (let i = 0; i < e.dataTransfer.types.length; i++) {
                if (e.dataTransfer.types[i] === 'Files') {
                    return true;
                }
            }
        }
        return false;
    }
    
    // Apply effects when dragging files over the box
    function applyDragEffects() {
        // Add custom class for styling
        uploadBox.classList.add('drag-active');
        
        // Scale up the box
        uploadBox.style.transform = 'scale(1.05)';
        
        // Change icon to down arrow and make it white
        uploadIcon.className = 'fa-regular fa-arrow-down';
        uploadIcon.style.color = 'var(--grey-000)';
        
        // Change text
        uploadText.textContent = 'Drop images here';
        uploadText.style.color = 'var(--grey-000)';
        
        // Rotate border effect - adding keyframe animation
        uploadBox.style.animation = 'rotateBorder 2s infinite linear';
        if (!document.getElementById('drag-drop-style')) {
            const style = document.createElement('style');
            style.id = 'drag-drop-style';
            style.innerHTML = `
                @keyframes rotateBorder {
                    0% { border-style: dashed; }
                    25% { border-style: solid; }
                    50% { border-style: dashed; }
                    75% { border-style: solid; }
                    100% { border-style: dashed; }
                }
                
                .drag-active {
                    background-color: rgba(249, 93, 0, 0.3) !important;
                    border-color: var(--orange-600) !important;
                    border-width: 2px !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Remove effects when dragging ends
    function removeDragEffects() {
        // Remove custom class
        uploadBox.classList.remove('drag-active');
        
        // Reset scale
        uploadBox.style.transform = '';
        
        // Reset icon
        uploadIcon.className = originalIconClass;
        uploadIcon.style.color = '';
        
        // Reset text
        uploadText.textContent = originalText;
        uploadText.style.color = '';
        
        // Remove animation
        uploadBox.style.animation = '';
    }
    
    // Handle the uploaded files (simulation for demo)
    function handleFiles(files) {
        // In a real implementation, you would process these files
        // For this demo, we'll just show a confirmation message
        
        console.log(`Processing ${files.length} files`);
        
        // Show notification
        const notificationBanner = document.getElementById('notification-banner');
        if (notificationBanner) {
            const bannerText = notificationBanner.querySelector('p');
            if (bannerText) {
                bannerText.textContent = `${files.length} image${files.length > 1 ? 's' : ''} uploaded`;
            }
            
            // Remove any existing classes and add success
            notificationBanner.className = 'notification-banner success-banner';
            notificationBanner.classList.add('active');
            
            // Hide the banner after 5 seconds
            setTimeout(() => {
                notificationBanner.classList.remove('active');
            }, 5000);
        }
        
        // In a real implementation, here you would:
        // 1. Upload the files to a server
        // 2. Create new image cards in the UI
        // 3. Update the image counter
        
        // Simulate adding images to grid (for demonstration)
        simulateImageAddition(files);
    }

     // Hide empty state message - make sure we select it and hide it
    const emptyStateMessage = document.querySelector('.empty-state-message');
        if (emptyStateMessage) {
            emptyStateMessage.style.display = 'none';
        }
    
    // Simulate adding images to the grid
    function simulateImageAddition(files) {
        // Find image grid or create it if it doesn't exist yet
        let imageGrid = document.querySelector('.image-grid');
        const emptyStateMessage = document.querySelector('.empty-state-message');
        
        // If we have an empty state message and no image grid, create the grid
        if (emptyStateMessage && !imageGrid) {
            // Hide empty state message
            emptyStateMessage.style.display = 'none';
            
            // Create image grid
            imageGrid = document.createElement('div');
            imageGrid.className = 'image-grid';
            
            // Insert grid before upload section
            const uploadSection = document.querySelector('.upload-section');
            if (uploadSection) {
                uploadSection.parentNode.insertBefore(imageGrid, uploadSection);
            }
        }
        
        // Only proceed if we have an image grid to add to
        if (!imageGrid) return;
        
        // Update counter
        const countElement = document.querySelector('.image-counter span span');
        let currentCount = countElement ? parseInt(countElement.textContent) || 0 : 0;
        
        // For each file, create an image card
        for (let i = 0; i < files.length; i++) {
            // Create elements
            const imageCard = document.createElement('div');
            imageCard.className = 'image-card';
            
            // Create a real URL from the file object
            const imageUrl = URL.createObjectURL(files[i]);

            imageCard.innerHTML = `
                <img src="${imageUrl}" alt="Uploaded image">
                <div class="image-overlay">
                    <button class="image-action-btn zoom-btn" data-img="${imageUrl}">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </button>
                    <button class="image-action-btn delete-btn">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            
            // Add to grid
            imageGrid.appendChild(imageCard);
            
            // Increment count
            currentCount++;
        }
        
        // Update the counter display
        if (countElement) {
            countElement.textContent = currentCount;
        }
        
        // Function to initialize event listeners for new image cards
       // Function to initialize event listeners for new image cards
function initializeImageCardInteractions() {
    // Find all zoom and delete buttons that need initialization
    const newZoomButtons = document.querySelectorAll('.image-card:not(.initialized) .zoom-btn');
    const newDeleteButtons = document.querySelectorAll('.image-card:not(.initialized) .delete-btn');
    
    // Get lightbox elements
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const deleteImageModal = document.getElementById('delete-image-modal');
    const confirmImageDelete = document.getElementById('confirm-image-delete');
    
    // Track which image is being deleted - make this a global variable
    window.currentImageElement = null;
    
    // Initialize zoom buttons
    newZoomButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            
            // Get the image URL from the data attribute
            const imgSrc = this.getAttribute('data-img');
            
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
    
    // Initialize delete buttons
    newDeleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            
            // Store reference to the current image card
            window.currentImageElement = this.closest('.image-card');
            
            // Show the delete confirmation modal
            if (deleteImageModal) {
                deleteImageModal.classList.add('active');
            }
        });
    });
    
    // Confirm delete notification banner
    if (confirmImageDelete && !confirmImageDelete.hasConfirmListener) {
        confirmImageDelete.addEventListener('click', function() {
            // Hide the delete confirmation modal
            if (deleteImageModal) {
                deleteImageModal.classList.remove('active');
            }
            
            // Remove the image
            if (window.currentImageElement) {
                // Get the parent grid to check how many images are left
                const imageGrid = window.currentImageElement.closest('.image-grid');
                
                // Remove the image with animation
                window.currentImageElement.style.opacity = '0';
                window.currentImageElement.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    // Actually remove the element
                    window.currentImageElement.remove();
                    window.currentImageElement = null;
                    
                    // Update the image counter
                    updateImageCounter(imageGrid);
                    
                    // Show the "Image deleted" notification
                    const notificationBanner = document.getElementById('notification-banner');
                    if (notificationBanner) {
                        // Update text and add specific class
                        const bannerText = notificationBanner.querySelector('p');
                        if (bannerText) {
                            bannerText.textContent = 'Image deleted';
                        }
                        
                        // Reset all classes first
                        notificationBanner.className = 'notification-banner';
                        
                        // Add the image-deleted class for red styling
                        notificationBanner.classList.add('image-deleted');
                        
                        // Add active to show the banner
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
        
        // Mark the button as having a listener
        confirmImageDelete.hasConfirmListener = true;
    }
    
            // Mark all new cards as initialized
            document.querySelectorAll('.image-card:not(.initialized)').forEach(card => {
                card.classList.add('initialized');
                // Add transition for smooth deletion
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            });
        }

        // Add this function for updating the counter
        function updateImageCounter(imageGrid) {
            if (!imageGrid) return;
            
            // Count the remaining images
            const remainingImages = imageGrid.querySelectorAll('.image-card').length;
            
            // Find and update the counter
            const imageCounter = document.querySelector('.image-counter');
            if (imageCounter) {
                const countSpan = imageCounter.querySelector('span span');
                if (countSpan) {
                    countSpan.textContent = remainingImages;
                }
            }
        }

        // Initialize the empty state message visibility based on whether there are images
        function initializeEmptyState() {
            const imageGrid = document.querySelector('.image-grid');
            const emptyStateMessage = document.querySelector('.empty-state-message');
            
            if (imageGrid && emptyStateMessage) {
                const imageCount = imageGrid.querySelectorAll('.image-card').length;
                emptyStateMessage.style.display = imageCount === 0 ? 'block' : 'none';
            }
        }

    // Enhanced version of simulateImageAddition function
    function simulateImageAddition(files) {
        // Find image grid or create it if it doesn't exist yet
        let imageGrid = document.querySelector('.image-grid');
        const emptyStateMessage = document.querySelector('.empty-state-message');
        
        // If we have an empty state message and no image grid, create the grid
        if (emptyStateMessage && !imageGrid) {
            // Hide empty state message
            emptyStateMessage.style.display = 'none';
            
            // Create image grid
            imageGrid = document.createElement('div');
            imageGrid.className = 'image-grid';
            
            // Insert grid before upload section
            const uploadSection = document.querySelector('.upload-section');
            if (uploadSection) {
                uploadSection.parentNode.insertBefore(imageGrid, uploadSection);
            }
        }
        
        // Only proceed if we have an image grid to add to
        if (!imageGrid) return;
        
        // Update counter
        const countElement = document.querySelector('.image-counter span span');
        let currentCount = countElement ? parseInt(countElement.textContent) || 0 : 0;
        
        // For each file, create an image card
        for (let i = 0; i < files.length; i++) {
            // Create elements
            const imageCard = document.createElement('div');
            imageCard.className = 'image-card';
            
            // Create a real URL from the file object
            const imageUrl = URL.createObjectURL(files[i]);

            imageCard.innerHTML = `
                <img src="${imageUrl}" alt="Uploaded image">
                <div class="image-overlay">
                    <button class="image-action-btn zoom-btn" data-img="${imageUrl}">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </button>
                    <button class="image-action-btn delete-btn">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            
            // Add to grid
            imageGrid.appendChild(imageCard);
            
            // Increment count
            currentCount++;
        }
        
        // Update the counter display
        if (countElement) {
            countElement.textContent = currentCount;
        }
        
        // Initialize image card interactions (zoom, delete)
        initializeImageCardInteractions();
        
        // IMPORTANT: Initialize drag functionality for new cards
        if (typeof window.initNewDraggableImages === 'function') {
            setTimeout(window.initNewDraggableImages, 100);
        }
    }

    initializeImageCardInteractions();
    }
});