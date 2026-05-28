document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================================
  // 1. HEADER BACKGROUND TRANSITION ON SCROLL (Dynamic Viewport Update)
  // ==========================================================================
  const header = document.querySelector(".Header");
  const aboutSection = document.querySelector("#About");
  
  if (header && aboutSection) {
    window.addEventListener("scroll", () => {
      // Gets the current dynamic distance from the top of the viewport to the #About section
      const sectionTop = aboutSection.getBoundingClientRect().top;

      // If the section top crosses or gets close to the header threshold (e.g., 50px)
      if (sectionTop <= 50) {
        header.style.backgroundColor = "rgba(0, 0, 0, 1)";
      } else {
        header.style.backgroundColor = "rgba(0, 0, 0, 0)";
      }
    });
  }

  // ==========================================================================
  // 2. MOBILE MENU TOGGLE (THREE DOTS)
  // ==========================================================================
  const menuBtn = document.querySelector(".menu-dots");
  const navMenu = document.querySelector("nav");

  if (menuBtn && navMenu) {
    // Toggle menu visibility when clicking the dots icon target
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Stops the event from instantly triggering the blanket document click closer
      navMenu.classList.toggle("open");
    });

    // Automatically close the menu overlay when an individual nav link inside it gets tapped
    navMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
      });
    });

    // Close the dropdown menu automatically if the user clicks anywhere else out on the screen canvas
    document.addEventListener("click", () => {
      navMenu.classList.remove("open");
    });
  }

  // ==========================================================================
  // 3. INTERACTIVE IMAGE SWAP (ABOUT SECTION) - DESKTOP & MOBILE COMPATIBLE
  // ==========================================================================
  const triggers = document.querySelectorAll(".hover-trigger");
  const image = document.querySelector(".Picture");

  triggers.forEach(trigger => {
    // Desktop Pointer Hover Events
    trigger.addEventListener("mouseenter", () => {
      if (window.innerWidth > 768) { // Only track if screen size matches desktop layouts
        const newSrc = trigger.getAttribute("data-image");
        if (newSrc && image) {
          image.src = newSrc;
          image.style.opacity = "1";
        }
      }
    });

    trigger.addEventListener("mouseleave", () => {
      if (window.innerWidth > 768 && image) {
        image.src = "";
        image.style.opacity = "0";
      }
    });

    // Mobile Touch/Tap Activation Interface Elements
    trigger.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const newSrc = trigger.getAttribute("data-image");
        
        if (!newSrc || !image) return;

        // If user taps an already active link, reset its visibility trace
        if (trigger.classList.contains("active-touch")) {
          trigger.classList.remove("active-touch");
          image.style.opacity = "0";
          setTimeout(() => { image.src = ""; }, 300);
        } else {
          // Clear previous active states from alternative option triggers
          triggers.forEach(t => t.classList.remove("active-touch"));
          
          trigger.classList.add("active-touch");
          image.src = newSrc;
          image.style.opacity = "1";
        }
      }
    });
  });

  // ==========================================================================
  // 4. MODAL CORE LOGIC (OPEN & CLOSE)
  // ==========================================================================
  const workItems = document.querySelectorAll(".work-item");
  const modals = document.querySelectorAll(".modal");

  function closeModal(modal) {
    modal.classList.remove("show");
    modal.style.display = "none";
    document.body.style.overflow = "";

    // Hard reset iframe configurations to slice playing media instantly
    const iframe = modal.querySelector("iframe");
    if (iframe) {
      iframe.src = "";
      setTimeout(() => {
        iframe.src = iframe.getAttribute("data-src") || "";
      }, 100);
    }
  }

  workItems.forEach(item => {
    item.addEventListener("click", event => {
      event.preventDefault();

      const modalId = item.getAttribute("data-modal");
      const modal = document.getElementById(modalId);
      if (!modal) return;

      const modalType = modal.getAttribute("data-type");

      modal.classList.add("show");
      modal.style.display = "flex";
      document.body.style.overflow = "hidden";

      const iframe = modal.querySelector("iframe");
      if (iframe) {
        const originalSrc = iframe.getAttribute("data-src") || iframe.src;
        iframe.setAttribute("data-src", originalSrc);
        iframe.src = originalSrc;
      }

      if (modalType === "carousel") {
        modal.dataset.currentSlide = "0";
        updateCarousel(modal, 0);
      }
    });
  });

  modals.forEach(modal => {
    const closeBtn = modal.querySelector(".close-modal") || modal.querySelector(".close-carousel");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => closeModal(modal));
    }

    modal.addEventListener("click", event => {
      if (event.target === modal) {
        closeModal(modal);
      }
    });
  });

  // ==========================================================================
  // 5. CAROUSELS
  // ==========================================================================
  function scrollCarousel(modal, direction) {
    const track = modal.querySelector(".carousel-track");
    if (!track) return;

    const items = track.children;
    const totalItems = items.length;
    if (totalItems === 0) return;

    let current = parseInt(modal.dataset.currentSlide || 0, 10);

    current += direction;
    if (current < 0) current = totalItems - 1;
    if (current >= totalItems) current = 0;

    modal.dataset.currentSlide = current;
    updateCarousel(modal, current);
  }

  function updateCarousel(modal, currentIndex) {
    const track = modal.querySelector(".carousel-track");
    if (track) {
      const offset = -currentIndex * 100;
      track.style.transform = `translateX(${offset}%)`;
    }
  }

  document.querySelectorAll(".modal-carousel").forEach(carousel => {
    const modal = carousel.closest(".modal");
    if (!modal) return;

    const leftArrow = carousel.querySelector(".arrow.left");
    const rightArrow = carousel.querySelector(".arrow.right");

    if (leftArrow) {
      leftArrow.addEventListener("click", (e) => {
        e.stopPropagation(); // Avoid triggering dark backdrop click closures unexpectedly
        scrollCarousel(modal, -1);
      });
    }
    if (rightArrow) {
      rightArrow.addEventListener("click", (e) => {
        e.stopPropagation();
        scrollCarousel(modal, 1);
      });
    }
  });
});
