document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // Header Scroll Effect
    // ==========================================================================
    const header = document.querySelector('.header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on load

    // ==========================================================================
    // Mobile Menu Toggle
    // ==========================================================================
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-btn .btn');

    const toggleMenu = () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        // Prevent body scrolling when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    };

    navToggle.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // ==========================================================================
    // Scroll Reveal Animation
    // ==========================================================================
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // ==========================================================================
    // Lightbox Gallery
    // ==========================================================================
    const galeriaItems = document.querySelectorAll('.galeria-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    
    let currentIndex = 0;
    const images = Array.from(galeriaItems).map(item => {
        return {
            src: item.getAttribute('data-src') || item.querySelector('img').src,
            alt: item.querySelector('img').alt
        };
    });

    const openLightbox = (index) => {
        currentIndex = index;
        lightboxImg.src = images[currentIndex].src;
        lightboxImg.alt = images[currentIndex].alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    const showPrev = (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        lightboxImg.src = images[currentIndex].src;
        lightboxImg.alt = images[currentIndex].alt;
    };

    const showNext = (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % images.length;
        lightboxImg.src = images[currentIndex].src;
        lightboxImg.alt = images[currentIndex].alt;
    };

    galeriaItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrev);
    lightboxNext.addEventListener('click', showNext);
    lightbox.addEventListener('click', closeLightbox);
    
    // Prevent closing when clicking the image itself
    lightboxImg.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPrev(e);
        } else if (e.key === 'ArrowRight') {
            showNext(e);
        }
    });

    // ==========================================================================
    // Testimonials Carousel
    // ==========================================================================
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const nextButton = document.querySelector('.carousel-control.next');
    const prevButton = document.querySelector('.carousel-control.prev');
    const dots = Array.from(document.querySelectorAll('.carousel-dot'));
    
    if (track && slides.length > 0) {
        let slideWidth = slides[0].getBoundingClientRect().width;
        let activeSlideIndex = 0;

        const updateSlideWidth = () => {
            slideWidth = slides[0].getBoundingClientRect().width;
            moveToSlide(activeSlideIndex);
        };

        // Recalculate slide width on window resize
        window.addEventListener('resize', updateSlideWidth);

        const moveToSlide = (index) => {
            track.style.transform = `translateX(-${slideWidth * index}px)`;
            
            // Update dots active status
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[index]) {
                dots[index].classList.add('active');
            }
            
            activeSlideIndex = index;
        };

        // Click next
        nextButton.addEventListener('click', () => {
            let nextIndex = (activeSlideIndex + 1) % slides.length;
            moveToSlide(nextIndex);
        });

        // Click prev
        prevButton.addEventListener('click', () => {
            let prevIndex = (activeSlideIndex - 1 + slides.length) % slides.length;
            moveToSlide(prevIndex);
        });

        // Click dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                moveToSlide(index);
            });
        });

        // Touch Swiping Support for Mobile
        let startX = 0;
        let endX = 0;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        }, { passive: true });

        track.addEventListener('touchend', () => {
            const diffX = startX - endX;
            if (Math.abs(diffX) > 40) {
                if (diffX > 0) {
                    // Swipe left -> Next slide
                    let nextIndex = (activeSlideIndex + 1) % slides.length;
                    moveToSlide(nextIndex);
                } else {
                    // Swipe right -> Prev slide
                    let prevIndex = (activeSlideIndex - 1 + slides.length) % slides.length;
                    moveToSlide(prevIndex);
                }
            }
            startX = 0;
            endX = 0;
        });

        // Autoplay every 6 seconds
        let autoplayInterval = setInterval(() => {
            let nextIndex = (activeSlideIndex + 1) % slides.length;
            moveToSlide(nextIndex);
        }, 6000);

        // Reset autoplay interval on user interactions
        const resetAutoplay = () => {
            clearInterval(autoplayInterval);
            autoplayInterval = setInterval(() => {
                let nextIndex = (activeSlideIndex + 1) % slides.length;
                moveToSlide(nextIndex);
            }, 8000);
        };

        nextButton.addEventListener('click', resetAutoplay);
        prevButton.addEventListener('click', resetAutoplay);
        dots.forEach(dot => dot.addEventListener('click', resetAutoplay));
        track.addEventListener('touchend', resetAutoplay);
        
        // Initial positioning
        setTimeout(updateSlideWidth, 200);
    }
});
