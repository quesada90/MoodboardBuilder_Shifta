document.addEventListener('DOMContentLoaded', function() {
    // Elements - Index page
    const addMoodboardBtn = document.getElementById('add-moodboard');
    const editModal = document.getElementById('edit-modal');
    const modalClose = document.querySelector('.modal-close');
    const coverUpload = document.getElementById('cover-upload');
    const shareButton = document.getElementById('share-button');
    const deleteButton = document.getElementById('delete-button');
    const saveButton = document.getElementById('save-button');
    const deleteConfirmModal = document.getElementById('delete-confirm-modal');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const notificationBanner = document.getElementById('notification-banner');
    
    // Elements - New moodboard page
    const editButton = document.getElementById('edit-button');
    
    // Elements for name editing
    const moodboardNameElement = document.querySelector('.moodboard-name');
    const editNameBtn = document.querySelector('.input-frame .fa-pen');
    const errorMessage = document.querySelector('.error-message');
    
    // Initially hide error message
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
    
    // Add pointer cursor to input frame
    const inputFrame = document.querySelector('.input-frame');
    if (inputFrame) {
        inputFrame.style.cursor = 'pointer';
    }
    
    // Update default moodboard name and color
    if (moodboardNameElement) {
        // Set default text and color
        if (moodboardNameElement.textContent === 'Street photoshoot' || 
            moodboardNameElement.textContent === 'New moodboard') {
            moodboardNameElement.textContent = 'Moodboard Title';
            moodboardNameElement.style.color = 'var(--grey-600)';
        } else {
            // If it's a custom name, use dark gray
            moodboardNameElement.style.color = 'var(--grey-900)';
        }
    }
    
    // Add hover effect to edit button
    if (editNameBtn) {
        editNameBtn.style.transition = 'color 0.2s ease';
        editNameBtn.addEventListener('mouseover', function() {
            this.style.color = 'var(--orange-600)';
        });
        editNameBtn.addEventListener('mouseout', function() {
            // Only return to default color if not in edit mode
            if (!this.classList.contains('editing')) {
                this.style.color = '';
            }
        });
    }

    // Make the moodboard name editable when clicked
    if (moodboardNameElement) {
        moodboardNameElement.style.cursor = 'pointer';
        moodboardNameElement.addEventListener('click', function() {
            // Only start editing if not already in edit mode
            if (!editNameBtn.classList.contains('editing')) {
                startEditing();
            }
        });
    }
    
    // Handle Share button click
    if (shareButton) {
        shareButton.addEventListener('click', function() {
            // Copy the current URL to clipboard
            navigator.clipboard.writeText(window.location.href)
                .then(() => {
                    // Show the "link copied" tooltip
                    shareButton.classList.add('active');
                    
                    // Hide it after 3 seconds
                    setTimeout(() => {
                        shareButton.classList.remove('active');
                    }, 3000);
                })
                .catch(err => {
                    console.error('Could not copy text: ', err);
                    alert('Failed to copy the link. Please try again.');
                });
        });
    }
    
    // Handle Edit button click on the moodboard page
    if (editButton) {
        editButton.addEventListener('click', function() {
            if (editModal) {
                editModal.classList.add('active');
            }
        });
    }
    
    // Open modal when adding a new moodboard
    if (addMoodboardBtn) {
        addMoodboardBtn.addEventListener('click', function() {
            editModal.classList.add('active');
        });
    }
    
    // Close modal when clicking the close button
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            editModal.classList.remove('active');
            // Hide error message when closing modal
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        });
    }
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === editModal) {
            editModal.classList.remove('active');
            // Hide error message when closing modal
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        }
        if (event.target === deleteConfirmModal) {
            deleteConfirmModal.classList.remove('active');
        }
    });
    
    // Handle Create Moodboard button click (from index.html)
    if (saveButton && window.location.pathname.includes('index.html')) {
        saveButton.addEventListener('click', function() {
            // Get the moodboard name
            const moodboardName = moodboardNameElement ? moodboardNameElement.textContent : '';
            
            // Validate the name
            if (!validateMoodboardName(moodboardName)) {
                // Show error message
                if (errorMessage) {
                    errorMessage.textContent = 'INVALID NAME! Must be longer than 2 characters and contain no special characters.';
                    errorMessage.style.display = 'block';
                }
                return;
            }
            
            // Store the moodboard name in localStorage
            localStorage.setItem('newMoodboardName', moodboardName);
            
            // Close the modal
            editModal.classList.remove('active');
            
            // Navigate to the empty new moodboard page
            window.location.href = 'new-moodboard.html';
        });
    }
    
    // Handle Delete button click
    if (deleteButton) {
        deleteButton.addEventListener('click', function() {
            // Hide the edit modal
            editModal.classList.remove('active');
            
            // Show the delete confirmation modal
            if (deleteConfirmModal) {
                deleteConfirmModal.classList.add('active');
            }
        });
    }
    
    // Handle Cancel Delete button click
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', function() {
            // Hide the delete confirmation modal
            deleteConfirmModal.classList.remove('active');
            
            // Show the edit modal again
            editModal.classList.add('active');
        });
    }
    
    // Handle Confirm Delete button click
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            // Hide the delete confirmation modal
            deleteConfirmModal.classList.remove('active');
            
            // Navigate to index.html with the deleted banner
            window.location.href = 'index.html?deleted=true';
        });
    }
    
    // Handle Save button click on moodboard pages
    if (saveButton && !window.location.pathname.includes('index.html')) {
        saveButton.addEventListener('click', function() {
            // Get the moodboard name
            const moodboardName = moodboardNameElement ? moodboardNameElement.textContent : '';
            
            // Validate the name
            if (!validateMoodboardName(moodboardName)) {
                // Show error message
                if (errorMessage) {
                    errorMessage.textContent = 'INVALID NAME! Must be longer than 2 characters and contain no special characters.';
                    errorMessage.style.display = 'block';
                }
                return;
            }
            
            // Hide the edit modal
            editModal.classList.remove('active');
            
            // Show the success notification banner
            if (notificationBanner) {
                notificationBanner.classList.add('active');
                
                // Hide it after 5 seconds
                setTimeout(() => {
                    notificationBanner.classList.remove('active');
                }, 5000);
            }
            
            // Update the page title if we're on a moodboard page
            const pageTitle = document.querySelector('.page-header .title-h1');
            if (pageTitle && moodboardNameElement) {
                pageTitle.textContent = moodboardNameElement.textContent;
            }
        });
    }
    
    // Check for the deleted parameter in the URL when loading the index page
    if (window.location.pathname.includes('index.html') && window.location.search.includes('deleted=true')) {
        if (notificationBanner) {
            notificationBanner.classList.add('active');
            
            // Hide it after 5 seconds
            setTimeout(() => {
                notificationBanner.classList.remove('active');
                
                // Remove the query parameter from the URL
                history.replaceState(null, document.title, window.location.pathname);
            }, 5000);
        }
    }
    
    // Cover upload area
    if (coverUpload) {
        // Add "Choose an image" text
        const helpText = document.createElement('span');
        helpText.textContent = 'Choose an image';
        helpText.style.position = 'absolute';
        helpText.style.bottom = '15px';
        helpText.style.fontSize = '14px';
        helpText.style.color = 'var(--grey-600)';
        coverUpload.style.position = 'relative';
        coverUpload.appendChild(helpText);
        
        // Add hover effect
        coverUpload.style.transition = 'border 0.3s ease, background-color 0.3s ease';
        coverUpload.addEventListener('mouseover', function() {
            this.style.border = '2px solid var(--orange-600)';
            this.style.backgroundColor = 'rgba(249, 93, 0, 0.1)';
        });
        coverUpload.addEventListener('mouseout', function() {
            if (!this.classList.contains('has-cover')) {
                this.style.border = '2px dashed var(--orange-600)';
                this.style.backgroundColor = '';
            }
        });
        
        coverUpload.addEventListener('click', function() {
            // Create a file input element
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);
            
            // Trigger a click on the file input
            fileInput.click();
            
            // Handle file selection
            fileInput.addEventListener('change', function() {
                if (fileInput.files && fileInput.files[0]) {
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        // Store the image data in localStorage to use when creating a new moodboard
                        localStorage.setItem('newMoodboardCoverImage', e.target.result);
                        
                        // Create an image element to display the cover
                        coverUpload.innerHTML = '';
                        coverUpload.classList.add('has-cover');
                        
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.style.width = '100%';
                        img.style.height = '100%';
                        img.style.objectFit = 'cover';
                        
                        coverUpload.appendChild(img);
                        
                        // Add a remove button
                        const removeBtn = document.createElement('button');
                        removeBtn.innerHTML = '×';
                        removeBtn.className = 'remove-cover-btn';
                        removeBtn.style.position = 'absolute';
                        removeBtn.style.top = '10px';
                        removeBtn.style.right = '10px';
                        removeBtn.style.backgroundColor = 'var(--orange-600)';
                        removeBtn.style.color = 'white';
                        removeBtn.style.border = 'none';
                        removeBtn.style.borderRadius = '50%';
                        removeBtn.style.width = '24px';
                        removeBtn.style.height = '24px';
                        removeBtn.style.display = 'flex';
                        removeBtn.style.alignItems = 'center';
                        removeBtn.style.justifyContent = 'center';
                        removeBtn.style.cursor = 'pointer';
                        removeBtn.style.fontSize = '16px';
                        removeBtn.style.fontWeight = 'bold';
                        removeBtn.style.lineHeight = '0'; // Fix vertical alignment
                        
                        // Add cover image to the related moodboard card if we're on the index page
                        if (window.location.pathname.includes('index.html')) {
                            const moodboardCards = document.querySelectorAll('.moodboard-card');
                            const emptyCard = document.querySelector('.moodboard-card-empty');
                            
                            if (emptyCard) {
                                const cardImage = emptyCard.querySelector('.card-image');
                                if (cardImage) {
                                    // This part would typically create a new card with the image
                                    console.log('Would update moodboard card with new image');
                                }
                            }
                        }
                        
                        // Make the cover element position relative for the remove button
                        coverUpload.style.position = 'relative';
                        coverUpload.appendChild(removeBtn);
                        
                        // Handle remove button click
                        removeBtn.addEventListener('click', function(e) {
                            e.stopPropagation(); // Prevent opening file dialog again
                            
                            // Remove the image and the button
                            coverUpload.innerHTML = '<span class="plus-icon">+</span>';
                            coverUpload.classList.remove('has-cover');
                            coverUpload.style.position = '';
                            
                            // Remove from localStorage
                            localStorage.removeItem('newMoodboardCoverImage');
                            
                            // Add back the help text
                            coverUpload.appendChild(helpText);
                        });
                    };
                    
                    reader.readAsDataURL(fileInput.files[0]);
                }
                
                // Remove the file input element
                document.body.removeChild(fileInput);
            });
        });
    }
    
    // Handle moodboard name editing
    if (editNameBtn && moodboardNameElement) {
        editNameBtn.addEventListener('click', function() {
            // Toggle edit mode
            if (this.classList.contains('editing')) {
                // Cancel editing
                cancelEditing();
            } else {
                // Start editing
                startEditing();
            }
        });
        
        // Function to start editing mode
        function startEditing() {
            // Make the moodboard name editable
            moodboardNameElement.contentEditable = true;
            moodboardNameElement.focus();
            
            // Select all text in the element
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(moodboardNameElement);
            selection.removeAllRanges();
            selection.addRange(range);
            
            // Add custom styling for edit mode
            moodboardNameElement.style.backgroundColor = 'var(--grey-200)';
            moodboardNameElement.style.outline = 'none';
            moodboardNameElement.style.padding = '0 4px';
            moodboardNameElement.style.color = 'var(--grey-900)'; // Dark grey for editing
            
            // Change parent frame to show focused state
            const inputFrame = moodboardNameElement.closest('.input-frame');
            if (inputFrame) {
                inputFrame.style.border = '2px solid var(--orange-600)';
                inputFrame.style.backgroundColor = 'var(--grey-200)';
                inputFrame.classList.add('editing');
            }
            
            // Change pen icon to X (close) icon
            editNameBtn.classList.remove('fa-pen');
            editNameBtn.classList.add('fa-close');
            editNameBtn.classList.add('editing');
            editNameBtn.style.color = 'var(--orange-600)';
            
            // Hide error message when starting to edit
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        }
        
        // Handle focus out of the editable name
        moodboardNameElement.addEventListener('blur', function(e) {
            // Don't finish editing if we clicked the cancel button
            // and it's going to handle the cancellation
            if (e.relatedTarget !== editNameBtn) {
                finishEditing();
            }
        });
        
        // Handle Enter key to finish editing
        moodboardNameElement.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                finishEditing();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                cancelEditing();
            }
        });
        
        // Function to cancel editing
        function cancelEditing() {
            moodboardNameElement.contentEditable = false;
            
            // Reset styles
            moodboardNameElement.style.backgroundColor = '';
            moodboardNameElement.style.padding = '';
            
            // Reset parent frame style
            const inputFrame = moodboardNameElement.closest('.input-frame');
            if (inputFrame) {
                inputFrame.style.border = '';
                inputFrame.style.backgroundColor = '';
                inputFrame.classList.remove('editing');
            }
            
            // Reset button to pen icon
            editNameBtn.classList.add('fa-pen');
            editNameBtn.classList.remove('fa-close');
            editNameBtn.classList.remove('editing');
            editNameBtn.style.color = '';
            
            // Hide error message
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        }
        
        // Function to finish editing and validate the name
        function finishEditing() {
            moodboardNameElement.contentEditable = false;
            
            // Reset styles
            moodboardNameElement.style.backgroundColor = '';
            moodboardNameElement.style.padding = '';
            
            // Reset parent frame style
            const inputFrame = moodboardNameElement.closest('.input-frame');
            if (inputFrame) {
                inputFrame.style.border = '';
                inputFrame.style.backgroundColor = '';
                inputFrame.classList.remove('editing');
            }
            
            // Reset button to pen icon
            editNameBtn.classList.add('fa-pen');
            editNameBtn.classList.remove('fa-close');
            editNameBtn.classList.remove('editing');
            editNameBtn.style.color = '';
            
            const newName = moodboardNameElement.textContent.trim();
            
            // Validate the name
            if (!validateMoodboardName(newName)) {
                // Show error message
                if (errorMessage) {
                    errorMessage.textContent = 'INVALID NAME! Must be longer than 2 characters and contain no special characters.';
                    errorMessage.style.display = 'block';
                }
                
                // Restore valid name
                moodboardNameElement.textContent = 'Moodboard Title';
                moodboardNameElement.style.color = 'var(--grey-600)';
            } else {
                // If it's the default name, use grey-600, otherwise use grey-900
                if (newName === 'Moodboard Title') {
                    moodboardNameElement.style.color = 'var(--grey-600)';
                } else {
                    moodboardNameElement.style.color = 'var(--grey-900)';
                }
                
                if (errorMessage) {
                    errorMessage.style.display = 'none';
                }
            }
        }
    }
    
    // Validation function for moodboard name
    function validateMoodboardName(name) {
        // Check if name is too short
        if (name.length < 3) {
            return false;
        }
        
        // Check for special characters
        const specialCharsRegex = /[.,:"?&*()_+@#$%^]/;
        if (specialCharsRegex.test(name)) {
            return false;
        }
        
        return true;
    }
    
    // NEW CODE - Check for cover image to add to new moodboard
    // This only runs on the new-moodboard.html page
    if (window.location.pathname.includes('new-moodboard.html')) {
        // Check if we have a cover image stored in localStorage
        const coverImageData = localStorage.getItem('newMoodboardCoverImage');
        
        if (coverImageData) {
            // Get references to page elements
            const imageGrid = document.querySelector('.image-grid');
            const emptyStateMessage = document.querySelector('.empty-state-message');
            const imageCounter = document.querySelector('.image-counter span span');
            
            // Hide empty state message if it exists
            if (emptyStateMessage) {
                emptyStateMessage.style.display = 'none';
            }
            
            // Create new image card with the cover image
            if (imageGrid) {
                const newCard = document.createElement('div');
                newCard.className = 'image-card';
                newCard.setAttribute('draggable', 'true');
                newCard.style.cursor = 'grab';
                newCard.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                
                newCard.innerHTML = `
                    <img src="${coverImageData}" alt="Cover image">
                    <div class="image-overlay">
                        <button class="image-action-btn zoom-btn" data-img="${coverImageData}">
                            <i class="fa-solid fa-magnifying-glass"></i>
                        </button>
                        <button class="image-action-btn delete-btn">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                `;
                
                // Add to the grid
                imageGrid.appendChild(newCard);
                
                // Update image counter
                if (imageCounter) {
                    imageCounter.textContent = '1';
                }
                
                // Initialize the zoom and delete buttons
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
                                const newConfirmBtn = confirmDeleteBtn.cloneNode(true);
                                confirmDeleteBtn.parentNode.replaceChild(newConfirmBtn, confirmDeleteBtn);
                                
                                newConfirmBtn.addEventListener('click', function() {
                                    deleteImageModal.classList.remove('active');
                                    
                                    // Remove the image with animation
                                    card.style.opacity = '0';
                                    card.style.transform = 'scale(0.8)';
                                    
                                    setTimeout(() => {
                                        card.remove();
                                        
                                        // Update the image counter
                                        if (imageCounter) {
                                            imageCounter.textContent = '0';
                                        }
                                        
                                        // Show empty message
                                        if (emptyStateMessage) {
                                            emptyStateMessage.style.display = 'block';
                                        }
                                        
                                        // Show notification
                                        const notificationBanner = document.getElementById('notification-banner');
                                        if (notificationBanner) {
                                            const bannerText = notificationBanner.querySelector('p');
                                            if (bannerText) {
                                                bannerText.textContent = 'Image deleted';
                                            }
                                            notificationBanner.className = 'notification-banner';
                                            notificationBanner.classList.add('error-banner');
                                            notificationBanner.classList.add('active');
                                            
                                            setTimeout(() => {
                                                notificationBanner.classList.remove('active');
                                            }, 5000);
                                        }
                                    }, 300);
                                });
                            }
                        }
                    });
                }
                
                // Initialize draggable functionality if available
                if (typeof window.initNewDraggableImages === 'function') {
                    setTimeout(window.initNewDraggableImages, 100);
                }
            }
            
            // Set the page title if we have a stored name
            const storedName = localStorage.getItem('newMoodboardName');
            if (storedName) {
                const pageTitleElement = document.querySelector('.page-header .title-h1');
                const moodboardNameElement = document.querySelector('.moodboard-name');
                
                if (pageTitleElement) {
                    pageTitleElement.textContent = storedName;
                }
                
                if (moodboardNameElement) {
                    moodboardNameElement.textContent = storedName;
                    moodboardNameElement.style.color = 'var(--grey-900)';
                }
            }
            
            // Clear the stored data after a delay
            setTimeout(() => {
                localStorage.removeItem('newMoodboardCoverImage');
                localStorage.removeItem('newMoodboardName');
            }, 30000);
        }
    }
});