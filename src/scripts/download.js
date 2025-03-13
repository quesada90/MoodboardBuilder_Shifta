// Advanced Image Download Functionality
document.addEventListener('DOMContentLoaded', function() {
    const downloadButton = document.getElementById('download-button');
    
    if (downloadButton) {
        downloadButton.addEventListener('click', function() {
            // First ensure we have all required libraries
            Promise.all([
                ensureScriptLoaded('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'),
                ensureScriptLoaded('https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js')
            ])
            .then(() => {
                prepareAndDownloadImages();
            })
            .catch(error => {
                console.error('Failed to load required libraries:', error);
                showNotification('Could not load required libraries. Please try again later.', 'error');
            });
        });
    }
    
    // Ensure external script is loaded
    function ensureScriptLoaded(url) {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (document.querySelector(`script[src="${url}"]`)) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    // Main function to prepare and download images
    function prepareAndDownloadImages() {
        const imageCards = document.querySelectorAll('.image-grid .image-card');
        
        if (imageCards.length === 0) {
            showNotification('No images to download', 'error');
            return;
        }
        
        showNotification('Preparing images for download...', 'success');
        
        // Get moodboard title for the filename
        const pageTitle = document.querySelector('.title-h1').textContent.trim() || 'moodboard';
        const safeTitle = pageTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        
        // Create a ZIP file
        const zip = new JSZip();
        const folder = zip.folder("images");
        
        // Process each image
        const promises = [];
        
        imageCards.forEach((card, index) => {
            const img = card.querySelector('img');
            if (!img || !img.src) return;
            
            // Create a promise for processing this image
            const promise = processImageForDownload(img, index)
                .then(result => {
                    if (result.success) {
                        folder.file(`image-${index + 1}.jpg`, result.blob);
                        return true;
                    }
                    return false;
                })
                .catch(err => {
                    console.error('Error processing image:', err);
                    return false;
                });
            
            promises.push(promise);
        });
        
        // When all images are processed
        Promise.all(promises)
            .then(results => {
                // Count successes
                const successCount = results.filter(Boolean).length;
                
                if (successCount === 0) {
                    showNotification('Could not download any images. Try saving them individually.', 'error');
                    return;
                }
                
                // Generate ZIP and trigger download
                zip.generateAsync({type: 'blob'})
                    .then(content => {
                        // Use FileSaver.js to save the ZIP
                        saveAs(content, `${safeTitle}-images.zip`);
                        
                        // Show success message
                        if (successCount < imageCards.length) {
                            showNotification(`Downloaded ${successCount} out of ${imageCards.length} images.`, 'success');
                        } else {
                            showNotification(`Successfully downloaded all ${successCount} images!`, 'success');
                        }
                    });
            })
            .catch(error => {
                console.error('Error creating ZIP:', error);
                showNotification('Error creating download. Please try again.', 'error');
            });
    }
    
    // Process a single image for download - using multiple approaches
    function processImageForDownload(img, index) {
        return new Promise((resolve, reject) => {
            // Try method 1: Canvas capture with crossOrigin
            const imgObj = new Image();
            imgObj.crossOrigin = 'anonymous';
            
            // Set a timeout to try an alternative method if this fails
            const timeout = setTimeout(() => {
                console.log('Canvas method timed out, trying direct fetch...');
                tryDirectFetch(img.src)
                    .then(blob => {
                        if (blob) {
                            resolve({ success: true, blob });
                        } else {
                            // If all fails, create a placeholder image
                            createPlaceholderImage(img.width, img.height, index)
                                .then(blob => {
                                    resolve({ success: true, blob });
                                })
                                .catch(() => resolve({ success: false }));
                        }
                    })
                    .catch(() => resolve({ success: false }));
            }, 3000);
            
            imgObj.onload = function() {
                clearTimeout(timeout);
                
                try {
                    // Create canvas
                    const canvas = document.createElement('canvas');
                    canvas.width = imgObj.width;
                    canvas.height = imgObj.height;
                    
                    // Draw image to canvas
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(imgObj, 0, 0);
                    
                    // Get blob from canvas
                    canvas.toBlob(blob => {
                        if (blob) {
                            resolve({ success: true, blob });
                        } else {
                            // Fall back to the alternative method
                            tryDirectFetch(img.src)
                                .then(blob => {
                                    if (blob) {
                                        resolve({ success: true, blob });
                                    } else {
                                        resolve({ success: false });
                                    }
                                })
                                .catch(() => resolve({ success: false }));
                        }
                    }, 'image/jpeg', 0.9);
                } catch (error) {
                    console.error('Canvas error:', error);
                    clearTimeout(timeout);
                    resolve({ success: false });
                }
            };
            
            imgObj.onerror = function() {
                clearTimeout(timeout);
                
                // Try direct fetch as fallback
                tryDirectFetch(img.src)
                    .then(blob => {
                        if (blob) {
                            resolve({ success: true, blob });
                        } else {
                            resolve({ success: false });
                        }
                    })
                    .catch(() => resolve({ success: false }));
            };
            
            // Start loading the image
            imgObj.src = img.src;
        });
    }
    
    // Try to fetch image directly (will likely fail due to CORS)
    function tryDirectFetch(url) {
        return fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.blob();
            })
            .catch(error => {
                console.error('Fetch error:', error);
                return null;
            });
    }
    
    // Create a placeholder image with text
    function createPlaceholderImage(width, height, index) {
        return new Promise((resolve, reject) => {
            try {
                // Default dimensions if not provided
                width = width || 400;
                height = height || 300;
                
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                
                // Fill background
                ctx.fillStyle = '#f95d00';  // Orange background
                ctx.fillRect(0, 0, width, height);
                
                // Add text
                ctx.fillStyle = '#ffffff';  // White text
                ctx.font = 'bold 20px Space Mono, monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                const text = 'Image #' + (index + 1);
                const text2 = 'Could not be downloaded';
                
                ctx.fillText(text, width / 2, height / 2 - 15);
                ctx.fillText(text2, width / 2, height / 2 + 15);
                
                // Get as blob
                canvas.toBlob(blob => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Could not create placeholder'));
                    }
                }, 'image/jpeg', 0.9);
            } catch (error) {
                reject(error);
            }
        });
    }
    
    // Helper to show notification
    function showNotification(message, type = 'success') {
        const notificationBanner = document.getElementById('notification-banner');
        if (!notificationBanner) return;
        
        // Update message
        const bannerText = notificationBanner.querySelector('p');
        if (bannerText) {
            bannerText.textContent = message;
        }
        
        // Set the appropriate class
        notificationBanner.className = 'notification-banner';
        if (type === 'success') {
            notificationBanner.classList.add('success-banner');
        } else if (type === 'error') {
            notificationBanner.classList.add('image-deleted'); // Reuse red styling
        }
        
        // Show notification
        notificationBanner.classList.add('active');
        
        // Hide after 5 seconds
        setTimeout(() => {
            notificationBanner.classList.remove('active');
        }, 5000);
    }
});