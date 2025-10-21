// Basic JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Website loaded successfully');
    
    // Welcome splash screen functionality (only on homepage)
    const welcomeSplash = document.getElementById('welcome-splash');
    if (welcomeSplash) {
        // Show splash screen for 3.5 seconds, then fade out
        setTimeout(() => {
            welcomeSplash.classList.add('fade-out');
            
            // Hide completely after fade animation
            setTimeout(() => {
                welcomeSplash.classList.add('hidden');
            }, 1500); // Match the CSS transition duration
        }, 3500); // Show for 3.5 seconds
    }
    
    // Homepage Image Carousel functionality
    const profileImages = document.querySelectorAll('.profile-image');
    const carouselDots = document.querySelectorAll('.carousel-dot');
    let currentImageIndex = 0;
    let carouselInterval;

    if (profileImages.length > 0) {
        let isFirstLoad = true;
        
        // Auto-advance carousel with longer delay for first image
        function startCarousel() {
            if (isFirstLoad) {
                // First image stays for 7 seconds
                setTimeout(() => {
                    nextImage();
                    isFirstLoad = false;
                    // Start regular 4-second interval after first change
                    carouselInterval = setInterval(() => {
                        nextImage();
                    }, 4000);
                }, 7000);
            } else {
                // Regular 4-second interval
                carouselInterval = setInterval(() => {
                    nextImage();
                }, 4000);
            }
        }

        function stopCarousel() {
            if (carouselInterval) {
                clearInterval(carouselInterval);
            }
        }

        function showImage(index) {
            // Remove active class from all images and dots
            profileImages.forEach(img => img.classList.remove('active'));
            carouselDots.forEach(dot => dot.classList.remove('active'));
            
            // Add active class to current image and dot
            if (profileImages[index]) {
                profileImages[index].classList.add('active');
            }
            if (carouselDots[index]) {
                carouselDots[index].classList.add('active');
            }
            
            currentImageIndex = index;
        }

        function nextImage() {
            const nextIndex = (currentImageIndex + 1) % profileImages.length;
            showImage(nextIndex);
        }

        function prevImage() {
            const prevIndex = (currentImageIndex - 1 + profileImages.length) % profileImages.length;
            showImage(prevIndex);
        }

        // Add click events to carousel dots
        carouselDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopCarousel();
                showImage(index);
                isFirstLoad = false; // Reset first load flag when user interacts
                startCarousel(); // Restart auto-advance
            });
        });

        // Pause carousel on hover, resume on mouse leave
        const imageCarousel = document.querySelector('.image-carousel');
        if (imageCarousel) {
            imageCarousel.addEventListener('mouseenter', stopCarousel);
            imageCarousel.addEventListener('mouseleave', startCarousel);
        }

        // Start the carousel
        startCarousel();
    }

    // Auto-fill copyright year
    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }
    
    // Add smooth scrolling for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add active navigation highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Contact form validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        // Form submission validation
        contactForm.addEventListener('submit', function(e) {
            // Clear previous errors
            clearAllErrors();
            
            // Check if form is valid and passwords match
            if (!contactForm.checkValidity() || !validatePasswordMatch()) {
                e.preventDefault();
                showValidationErrors();
                if (!validatePasswordMatch()) {
                    showError('confirmPassword', 'Passwords do not match');
                }
            }
        });
        
        // Real-time validation for required fields
        const requiredFields = contactForm.querySelectorAll('input[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(field);
            });
        });
        
        // Real-time password confirmation validation
        const confirmPasswordField = document.getElementById('confirmPassword');
        if (confirmPasswordField) {
            confirmPasswordField.addEventListener('blur', function() {
                validatePasswordMatch();
            });
            confirmPasswordField.addEventListener('input', function() {
                if (this.value.length > 0) {
                    validatePasswordMatch();
                }
            });
        }
    }
    
    // Helper functions for form validation
    function validateField(field) {
        const fieldName = field.name;
        const errorId = fieldName + '-error';
        
        if (!field.checkValidity()) {
            let errorMessage = '';
            
            if (field.validity.valueMissing) {
                errorMessage = 'This field is required';
            } else if (field.validity.typeMismatch) {
                errorMessage = 'Please enter a valid email address';
            } else if (field.validity.tooShort) {
                errorMessage = `Password must be at least ${field.minLength} characters`;
            }
            
            showError(fieldName, errorMessage);
        } else {
            clearError(fieldName);
        }
    }
    
    function validatePasswordMatch() {
        const passwordField = document.getElementById('password');
        const confirmPasswordField = document.getElementById('confirmPassword');
        
        if (passwordField && confirmPasswordField) {
            const password = passwordField.value;
            const confirmPassword = confirmPasswordField.value;
            
            if (confirmPassword.length > 0 && password !== confirmPassword) {
                showError('confirmPassword', 'Passwords do not match');
                return false;
            } else if (confirmPassword.length > 0 && password === confirmPassword) {
                clearError('confirmPassword');
                return true;
            }
        }
        return true;
    }
    
    function showError(fieldName, message) {
        const errorElement = document.getElementById(fieldName + '-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    function clearError(fieldName) {
        const errorElement = document.getElementById(fieldName + '-error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }
    
    function clearAllErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
    }
    
    function showValidationErrors() {
        const invalidFields = contactForm.querySelectorAll('input:invalid');
        invalidFields.forEach(field => {
            validateField(field);
        });
    }
    
    // Image Gallery functionality
    const galleries = document.querySelectorAll('.project-gallery');
    galleries.forEach(gallery => {
        const images = gallery.querySelectorAll('.gallery-image');
        const prevBtn = gallery.querySelector('.prev-btn');
        const nextBtn = gallery.querySelector('.next-btn');
        const indicators = gallery.querySelectorAll('.indicator');
        
        let currentIndex = 0;
        
        function showImage(index) {
            // Hide all images
            images.forEach(img => img.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));
            
            // Show current image
            images[index].classList.add('active');
            indicators[index].classList.add('active');
            
            currentIndex = index;
        }
        
        function nextImage() {
            const nextIndex = (currentIndex + 1) % images.length;
            showImage(nextIndex);
        }
        
        function prevImage() {
            const prevIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(prevIndex);
        }
        
        // Event listeners
        if (nextBtn) nextBtn.addEventListener('click', nextImage);
        if (prevBtn) prevBtn.addEventListener('click', prevImage);
        
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => showImage(index));
        });
        
        // Keyboard navigation
        gallery.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevImage();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            }
        });
        
        // Auto-advance (optional - uncomment if desired)
        // setInterval(nextImage, 5000);
    });

    // Separate Lightbox functionality for each project
    
    // AI Platform Lightbox
    const aiLightboxModal = document.getElementById('ai-lightbox-modal');
    const aiLightboxImage = document.getElementById('ai-lightbox-image');
    const aiLightboxClose = document.querySelector('.ai-lightbox-close');
    const aiPrevLightbox = document.querySelector('.ai-prev-lightbox');
    const aiNextLightbox = document.querySelector('.ai-next-lightbox');
    const aiCurrentImageSpan = document.getElementById('ai-current-image');
    const aiTotalImagesSpan = document.getElementById('ai-total-images');

    let aiLightboxImages = [];
    let currentAiLightboxIndex = 0;

    // Research Project Lightbox
    const researchLightboxModal = document.getElementById('research-lightbox-modal');
    const researchLightboxImage = document.getElementById('research-lightbox-image');
    const researchLightboxClose = document.querySelector('.research-lightbox-close');
    const researchPrevLightbox = document.querySelector('.research-prev-lightbox');
    const researchNextLightbox = document.querySelector('.research-next-lightbox');
    const researchCurrentImageSpan = document.getElementById('research-current-image');
    const researchTotalImagesSpan = document.getElementById('research-total-images');

    let researchLightboxImages = [];
    let currentResearchLightboxIndex = 0;

    // Get AI Platform images
    const aiProjectImages = document.querySelectorAll('.project-screenshot');
    aiProjectImages.forEach(img => {
        aiLightboxImages.push({
            src: img.getAttribute('data-fullsize'),
            alt: img.getAttribute('alt')
        });
    });

    // Get Research Project images
    const researchGalleryImages = document.querySelectorAll('.gallery-image');
    researchGalleryImages.forEach(img => {
        researchLightboxImages.push({
            src: img.getAttribute('data-fullsize'),
            alt: img.getAttribute('alt')
        });
    });

    // Set total images count
    if (aiTotalImagesSpan) {
        aiTotalImagesSpan.textContent = aiLightboxImages.length;
    }
    if (researchTotalImagesSpan) {
        researchTotalImagesSpan.textContent = researchLightboxImages.length;
    }

    // Add click events to AI Platform images
    aiProjectImages.forEach((img, index) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            openAiLightbox(index);
        });
    });

    // Add click events to Research Project images
    researchGalleryImages.forEach((img, index) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            openResearchLightbox(index);
        });
    });

    // AI Platform Lightbox Functions
    function openAiLightbox(index) {
        currentAiLightboxIndex = index;
        updateAiLightboxImage();
        aiLightboxModal.classList.add('active');
        aiLightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeAiLightbox() {
        aiLightboxModal.classList.remove('active');
        aiLightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function updateAiLightboxImage() {
        if (aiLightboxImages[currentAiLightboxIndex]) {
            aiLightboxImage.src = aiLightboxImages[currentAiLightboxIndex].src;
            aiLightboxImage.alt = aiLightboxImages[currentAiLightboxIndex].alt;
            aiCurrentImageSpan.textContent = currentAiLightboxIndex + 1;
            
            if (aiPrevLightbox) {
                aiPrevLightbox.disabled = currentAiLightboxIndex === 0;
            }
            if (aiNextLightbox) {
                aiNextLightbox.disabled = currentAiLightboxIndex === aiLightboxImages.length - 1;
            }
        }
    }

    function nextAiLightboxImage() {
        if (currentAiLightboxIndex < aiLightboxImages.length - 1) {
            currentAiLightboxIndex++;
            updateAiLightboxImage();
        }
    }

    function prevAiLightboxImage() {
        if (currentAiLightboxIndex > 0) {
            currentAiLightboxIndex--;
            updateAiLightboxImage();
        }
    }

    // Research Project Lightbox Functions
    function openResearchLightbox(index) {
        currentResearchLightboxIndex = index;
        updateResearchLightboxImage();
        researchLightboxModal.classList.add('active');
        researchLightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeResearchLightbox() {
        researchLightboxModal.classList.remove('active');
        researchLightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function updateResearchLightboxImage() {
        if (researchLightboxImages[currentResearchLightboxIndex]) {
            researchLightboxImage.src = researchLightboxImages[currentResearchLightboxIndex].src;
            researchLightboxImage.alt = researchLightboxImages[currentResearchLightboxIndex].alt;
            researchCurrentImageSpan.textContent = currentResearchLightboxIndex + 1;
            
            if (researchPrevLightbox) {
                researchPrevLightbox.disabled = currentResearchLightboxIndex === 0;
            }
            if (researchNextLightbox) {
                researchNextLightbox.disabled = currentResearchLightboxIndex === researchLightboxImages.length - 1;
            }
        }
    }

    function nextResearchLightboxImage() {
        if (currentResearchLightboxIndex < researchLightboxImages.length - 1) {
            currentResearchLightboxIndex++;
            updateResearchLightboxImage();
        }
    }

    function prevResearchLightboxImage() {
        if (currentResearchLightboxIndex > 0) {
            currentResearchLightboxIndex--;
            updateResearchLightboxImage();
        }
    }

    // Event listeners for AI Platform lightbox
    if (aiLightboxClose) {
        aiLightboxClose.addEventListener('click', closeAiLightbox);
    }
    if (aiPrevLightbox) {
        aiPrevLightbox.addEventListener('click', prevAiLightboxImage);
    }
    if (aiNextLightbox) {
        aiNextLightbox.addEventListener('click', nextAiLightboxImage);
    }

    // Event listeners for Research Project lightbox
    if (researchLightboxClose) {
        researchLightboxClose.addEventListener('click', closeResearchLightbox);
    }
    if (researchPrevLightbox) {
        researchPrevLightbox.addEventListener('click', prevResearchLightboxImage);
    }
    if (researchNextLightbox) {
        researchNextLightbox.addEventListener('click', nextResearchLightboxImage);
    }

    // Close lightboxes when clicking outside
    aiLightboxModal.addEventListener('click', (e) => {
        if (e.target === aiLightboxModal) {
            closeAiLightbox();
        }
    });

    researchLightboxModal.addEventListener('click', (e) => {
        if (e.target === researchLightboxModal) {
            closeResearchLightbox();
        }
    });

    // Keyboard navigation for both lightboxes
    document.addEventListener('keydown', (e) => {
        if (aiLightboxModal.classList.contains('active')) {
            switch (e.key) {
                case 'Escape':
                    closeAiLightbox();
                    break;
                case 'ArrowLeft':
                    prevAiLightboxImage();
                    break;
                case 'ArrowRight':
                    nextAiLightboxImage();
                    break;
            }
        } else if (researchLightboxModal.classList.contains('active')) {
            switch (e.key) {
                case 'Escape':
                    closeResearchLightbox();
                    break;
                case 'ArrowLeft':
                    prevResearchLightboxImage();
                    break;
                case 'ArrowRight':
                    nextResearchLightboxImage();
                    break;
            }
        }
    });
});
