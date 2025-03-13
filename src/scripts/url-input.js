// URL Input Handler for adding images - simplified version
document.addEventListener('DOMContentLoaded', function() {
    const urlButton = document.querySelector('.url-button');
    const urlUpload = document.querySelector('.url-upload');
    let urlInputContainer = null;
    let urlForm = null;
    
    // Initialize URL input functionality
    function initUrlInput() {
        if (!urlButton || !urlUpload) return;
        
        // Handle click on "Add URLs" button
        urlButton.addEventListener('click', function() {
            // If the input container already exists, just focus on it
            if (urlInputContainer && urlInputContainer.querySelector('.url-input-field')) {
                const inputField = urlInputContainer.querySelector('.url-input-field');
                inputField.focus();
                return;
            }
            
            // Create the input container and form
            createUrlInputForm();
        });
    }
    
    // Create the URL input form
    function createUrlInputForm() {
        // Create container
        urlInputContainer = document.createElement('div');
        urlInputContainer.className = 'url-input-container';
        
        // Create form
        urlForm = document.createElement('form');
        urlForm.addEventListener('submit', handleUrlSubmit);
        
        // Create input field
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.className = 'url-input-field';
        inputField.placeholder = 'Paste image URL here...';
        inputField.required = true;
        
        // Create submit button
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.className = 'url-form-button';
        submitButton.textContent = 'Add Image';
        
        // Create footnote
        const footnote = document.createElement('div');
        footnote.className = 'url-form-footnote';
        footnote.textContent = 'Add one or more URLs, separated by commas';
        
        // Create message container (hidden initially)
        const messageContainer = document.createElement('div');
        messageContainer.className = 'url-form-message';
        messageContainer.style.display = 'none';
        
        // Append elements to form
        urlForm.appendChild(inputField);
        urlForm.appendChild(submitButton);
        
        // Append elements to container
        urlInputContainer.appendChild(urlForm);
        urlInputContainer.appendChild(footnote);
        urlInputContainer.appendChild(messageContainer);
        
        // Append container to the URL upload section
        urlUpload.appendChild(urlInputContainer);
        
        // Focus on the input field
        inputField.focus();
    }
    
    // Handle URL form submission
    function handleUrlSubmit(e) {
        e.preventDefault();
        
        const inputField = urlForm.querySelector('.url-input-field');
        const messageContainer = urlInputContainer.querySelector('.url-form-message');
        
        if (!inputField || !messageContainer) return;
        
        // Get URLs (trim whitespace and split by commas)
        const urlsInput = inputField.value.trim();
        const urls = urlsInput.split(',').map(url => url.trim()).filter(url => url.length > 0);
        
        if (urls.length === 0) {
            showMessage(messageContainer, 'Please enter at least one valid URL', 'error');
            return;
        }
        
        // Track validation state
        let allValid = true;
        let validCount = 0;
        
        // Process each URL
        const imageGrid = document.querySelector('.image-grid');
        if (!imageGrid) {
            showMessage(messageContainer, 'Could not find the image grid', 'error');
            return;
        }
        
        // Show loading message
        showMessage(messageContainer, 'Validating URLs...', 'success');
        
        // Process URLs one by one with validation
        let processedCount = 0;
        
        urls.forEach(url => {
            validateImageUrl(url)
                .then(isValid => {
                    processedCount++;
                    
                    if (isValid) {
                        // Create new image card
                        const newCard = createImageCard(url);
                        imageGrid.appendChild(newCard);
                        validCount++;
                        
                        // Update image counter
                        updateImageCounter(1);
                        
                        // Hide empty state message if it exists
                        const emptyState = document.querySelector('.empty-state-message');
                        if (emptyState) {
                            emptyState.style.display = 'none';
                        }
                    } else {
                        allValid = false;
                    }
                    
                    // Check if all URLs have been processed
                    if (processedCount === urls.length) {
                        if (validCount > 0) {
                            if (allValid) {
                                showMessage(messageContainer, `Successfully added ${validCount} image${validCount > 1 ? 's' : ''}`, 'success');
                            } else {
                                showMessage(messageContainer, `Added ${validCount} image${validCount > 1 ? 's' : ''}, but some URLs were invalid`, 'success');
                            }
                            
                            // Clear the input field
                            inputField.value = '';
                            inputField.focus();
                            
                            // Initialize draggable on new images
                            if (typeof window.initNewDraggableImages === 'function') {
                                setTimeout(window.initNewDraggableImages, 100);
                            }
                        } else {
                            showMessage(messageContainer, 'None of the provided URLs contain valid images', 'error');
                        }
                    }
                    initDragAfterUrlUpload(imageGrid);
                })
                .catch(error => {
                    processedCount++;
                    allValid = false;
                    
                    if (processedCount === urls.length && validCount === 0) {
                        showMessage(messageContainer, 'Error validating URLs. Please check your input.', 'error');
                    }
                });
        });
    }
    
    // Validate if a URL is a valid image
    function validateImageUrl(url) {
        return new Promise((resolve, reject) => {
            let validatedUrl = url;
            
            if (!url.match(/^https?:\/\//i)) {
                // If it doesn't start with http:// or https://, try adding https://
                if (!url.match(/^[a-z]+:\/\//i)) {
                    validatedUrl = 'https://' + url;
                } else {
                    resolve(false);
                    return;
                }
            }
            
            const img = new Image();
            
            // Set a timeout in case the image takes too long
            const timeout = setTimeout(() => {
                img.src = '';
                resolve(false);
            }, 5000);
            
            img.onload = () => {
                clearTimeout(timeout);
                resolve(true);
            };
            
            img.onerror = () => {
                clearTimeout(timeout);
                resolve(false);
            };
            
            img.src = validatedUrl;
        });
    }
    
    // Create new image card
    function createImageCard(imageUrl) {
        const newCard = document.createElement('div');
        newCard.className = 'image-card';
        
        newCard.innerHTML = `
            <img src="${imageUrl}" alt="Added image">
            <div class="image-overlay">
                <button class="image-action-btn zoom-btn" data-img="${imageUrl}">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </button>
                <button class="image-action-btn delete-btn">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        
        // Add event listeners for zoom and delete buttons
        const zoomBtn = newCard.querySelector('.zoom-btn');
        const deleteBtn = newCard.querySelector('.delete-btn');
        
        if (zoomBtn) {
            zoomBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const imgSrc = this.getAttribute('data-img');
                const lightbox = document.getElementById('image-lightbox');
                const lightboxImage = document.getElementById('lightbox-image');
                
                if (lightboxImage) {
                    lightboxImage.src = imgSrc;
                }
                
                if (lightbox) {
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const card = this.closest('.image-card');
                const deleteImageModal = document.getElementById('delete-image-modal');
                
                if (deleteImageModal) {
                    deleteImageModal.classList.add('active');
                    
                    // Set up confirmation button to delete this specific card
                    const confirmDeleteBtn = document.getElementById('confirm-image-delete');
                    if (confirmDeleteBtn) {
                        // Remove previous event listeners
                        const newConfirmBtn = confirmDeleteBtn.cloneNode(true);
                        confirmDeleteBtn.parentNode.replaceChild(newConfirmBtn, confirmDeleteBtn);
                        
                        // Add new event listener for this specific card
                        newConfirmBtn.addEventListener('click', function() {
                            deleteImageModal.classList.remove('active');
                            
                            // Remove the image with animation
                            card.style.opacity = '0';
                            card.style.transform = 'scale(0.8)';
                            
                            setTimeout(() => {
                                card.remove();
                                
                                // Update the image counter
                                updateImageCounter(-1); // Decrement counter
                                
                                // Show notification
                                const notificationBanner = document.getElementById('notification-banner');
                                if (notificationBanner) {
                                    const bannerText = notificationBanner.querySelector('p');
                                    if (bannerText) {
                                        bannerText.textContent = 'Image deleted';
                                    }
                                    
                                    // Reset classes first
                                    notificationBanner.className = 'notification-banner';
                                    
                                    // Add image-deleted class for red styling
                                    notificationBanner.classList.add('image-deleted');
                                    
                                    // Show the banner
                                    notificationBanner.classList.add('active');
                                    
                                    setTimeout(() => {
                                        notificationBanner.classList.remove('active');
                                        setTimeout(() => {
                                            notificationBanner.classList.remove('image-deleted');
                                        }, 300);
                                    }, 5000);
                                }
                            }, 300);
                        });
                    }
                }
            });
        }
        
        return newCard;
    }

    // Ensure new function is added outside any existing functions
    function initDragAfterUrlUpload(grid) {
        // Initialize draggable functionality on newly added images
        if (typeof window.initNewDraggableImages === 'function') {
            setTimeout(window.initNewDraggableImages, 100);
        }
    }
    
    // Show success or error message
    function showMessage(container, message, type) {
        if (!container) return;
        
        container.textContent = message;
        container.className = `url-form-message ${type}`;
        container.style.display = 'block';
        
        // Hide message after a few seconds for success messages
        if (type === 'success' && message !== 'Validating URLs...') {
            setTimeout(() => {
                container.style.opacity = '0';
                setTimeout(() => {
                    container.style.display = 'none';
                    container.style.opacity = '1';
                }, 300);
            }, 5000);
        }
    }
    
    // Update image counter
    function updateImageCounter(increment) {
        const imageCounter = document.querySelector('.image-counter');
        if (!imageCounter) return;
        
        const countSpan = imageCounter.querySelector('span span');
        if (!countSpan) return;
        
        let currentCount = parseInt(countSpan.textContent) || 0;
        
        if (increment === -1) {
            // Decrement mode
            currentCount = currentCount - 1;
        } else {
            // Increment mode
            currentCount = currentCount + increment;
        }
        
        countSpan.textContent = currentCount;
        
        // Toggle empty state message if count is 0
        const emptyStateMessage = document.querySelector('.empty-state-message');
        if (emptyStateMessage) {
            emptyStateMessage.style.display = currentCount === 0 ? 'block' : 'none';
            console.log(`Image count: ${currentCount}, Empty state visibility: ${emptyStateMessage.style.display}`);
        }
    }
    
    // Initialize URL input functionality
    initUrlInput();
});