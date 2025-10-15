// Ensure GSAP is registered
gsap.registerPlugin(ScrollTrigger);

// =======================================================
// GSAP Animations for Home Page
// =======================================================
function initHomePageAnimations() {
    // 1. Initial Load/Hero Animation (Header, Title, Slogan)
    gsap.from(".logo, .nav-item", { 
        y: -50, 
        opacity: 0, 
        duration: 1, 
        stagger: 0.1, 
        ease: "power2.out" 
    });
    
    gsap.from(".title-text", { 
        opacity: 0, 
        scale: 0.8, 
        duration: 1.5, 
        delay: 0.5, 
        ease: "back.out(1.2)" 
    });
    
    gsap.to(".slogan-text", { 
        opacity: 1, 
        duration: 1.5, 
        delay: 1.5, 
        ease: "power2.out" 
    });

    // 2. Parallax Effect for Hero Background
    gsap.to("#hero > div", {
        y: (i, target) => -100, // Move background up slightly slower than scroll
        ease: "none",
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: true, // Smoothly link animation to scroll
        }
    });

    // 3. Scroll-based Section Reveals (Staggered Fade-in)
    
    // Brand Intro
    gsap.from(".section-title, .section-text p", {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 1,
        ease: "power1.out",
        scrollTrigger: {
            trigger: "#intro",
            start: "top 80%", // Start when section enters 80% down the viewport
            toggleActions: "play none none reverse", // Play once, reverse when scrolling back
        }
    });
    
    // Collection Preview
    gsap.from(".section-title-2, .collection-item", {
        opacity: 0,
        y: 50,
        stagger: 0.3,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: "#collection",
            start: "top 80%",
            toggleActions: "play none none reverse",
        }
    });

    // Shop Button Fade-in
    gsap.from(".shop-btn", {
        opacity: 0,
        scale: 0.9,
        duration: 1,
        delay: 0.8,
        ease: "power2.out",
        scrollTrigger: {
            trigger: "#collection",
            start: "bottom 90%",
            toggleActions: "play none none reverse",
        }
    });
}

// =======================================================
// GSAP Animations for Shop Page
// =======================================================
function initShopPageAnimations() {
    // Title Fade-in
    gsap.from(".shop-title", {
        opacity: 0,
        y: -30,
        duration: 1.2,
        ease: "power2.out",
    });

    // Staggered grid reveal for product cards
    gsap.from(".product-card", {
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".product-grid",
            start: "top 85%",
            toggleActions: "play none none reverse",
        }
    });
}

// =======================================================
// Product Popup Logic (Shop Page)
// =======================================================

const popup = document.getElementById('product-popup');
const popupContainer = popup ? popup.querySelector(':scope > div') : null; // Get the inner container
const popupContent = popup ? popup.querySelector('.popup-content') : null;

/**
 * Opens the product detail popup with information from the clicked card.
 * @param {HTMLElement} card - The product card element clicked.
 */
function openProductPopup(card) {
    if (!popup || !popupContainer) return;

    // 1. Populate Content
    document.getElementById('popup-name').textContent = card.dataset.name;
    document.getElementById('popup-price').textContent = card.dataset.price;
    document.getElementById('popup-desc').textContent = card.dataset.desc;
    document.getElementById('popup-notes').textContent = card.dataset.notes;
    document.getElementById('popup-image').src = card.dataset.image;
    document.getElementById('popup-image').alt = card.dataset.name;

    // 2. Show Modal (Tailwind classes)
    popup.classList.remove('opacity-0', 'pointer-events-none');
    popupContainer.classList.remove('scale-95');
    
    // 3. GSAP Animation for Modal Content (Staggered fade/slide in)
    // First, reset elements to initial state (opacity 0 and slight transform)
    gsap.set("#popup-image, #popup-name, #popup-price, #popup-desc, #popup-notes, .buy-btn, .buy-btn-text, .info-container h3", { 
        opacity: 0, 
        y: (i, target) => target.classList.contains('buy-btn') || target.classList.contains('buy-btn-text') ? 0 : 20, 
        x: (i, target) => target.parentElement.classList.contains('info-container') ? 20 : 0
    });


    // Animate the image and info text
    gsap.to("#popup-image", {
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        ease: "power3.out"
    });
    
    gsap.to("#popup-name, #popup-price, #popup-desc, #popup-notes, .info-container h3", {
        opacity: 1, 
        x: 0, 
        duration: 0.6, 
        stagger: 0.1, 
        ease: "power2.out",
        delay: 0.3 // Delay relative to image start
    });

    // Animate the buttons/final text
    gsap.to(".buy-btn, .buy-btn-text", {
        opacity: 1,
        duration: 0.5,
        stagger: 0.05,
        ease: "power1.out",
        delay: 1.2
    });

    // Prevent background scroll
    document.body.style.overflow = 'hidden';
}

/**
 * Closes the product detail popup.
 */
function closeProductPopup() {
    if (!popup || !popupContainer) return;

    // 1. GSAP Animation Out (Scale down and fade out the container)
    gsap.to(popupContainer, {
        scale: 0.95,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
            // 2. Hide Modal (Tailwind classes)
            popup.classList.add('opacity-0', 'pointer-events-none');
            popupContainer.classList.add('scale-95'); // Reset for next open
            popupContainer.style.opacity = 1; // Reset GSAP property
            
            // Allow background scroll
            document.body.style.overflow = ''; 
        }
    });
}