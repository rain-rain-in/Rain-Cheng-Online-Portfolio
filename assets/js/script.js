document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================================
  // 1. HEADER BACKGROUND TRANSITION ON SCROLL
  // ==========================================================================
  const header = document.querySelector(".Header");
  const aboutSection = document.querySelector("#About");
  
  if (header && aboutSection) {
    const triggerPoint = aboutSection.offsetTop;

    window.addEventListener("scroll", () => {
      if (window.scrollY >= triggerPoint - 50) {
        header.style.backgroundColor = "rgba(0, 0, 0, 1)";
      } else {
        header.style.backgroundColor = "rgba(0, 0, 0, 0)";
      }
    });
  }

  // ==========================================================================
  // 2. HOVER-TRIGGERED IMAGE SWAP (ABOUT SECTION)
  // ==========================================================================
  const triggers = document.querySelectorAll(".hover-trigger");
  const image = document.querySelector(".Picture");

  triggers.forEach(trigger => {
    trigger.addEventListener("mouseenter", () => {
      const newSrc = trigger.getAttribute("data-image");
      if (newSrc && image) {
        image.src = newSrc;
        image.style.opacity = "1";
      }
    });

    trigger.addEventListener("mouseleave", () => {
      if (image) {
        image.src = "";
        image.style.opacity = "0";
      }
    });
  });

  // ==========================================================================
  // 3. MODAL CORE LOGIC (OPEN & CLOSE)
  // ==========================================================================
  const workItems = document.querySelectorAll(".work-item");
  const modals = document.querySelectorAll(".modal");

  // Function to safely close a modal and reset its contents
  function closeModal(modal) {
    modal.classList.remove("show");
    modal.style.display = "none";
    document.body.style.overflow = "";

    // Stop video playback by clearing src, then restore it for next opening
    const iframe = modal.querySelector("iframe");
    if (iframe) {
      iframe.src = "";
      setTimeout(() => {
        iframe.src = iframe.getAttribute("data-src") || "";
      }, 100);
    }
  }

  // Open modal on item click
  workItems.forEach(item => {
    item.addEventListener("click", event => {
      event.preventDefault(); // Prevent accidental page jumps

      const modalId = item.getAttribute("data-modal");
      const modal = document.getElementById(modalId);
      if (!modal) return;

      const modalType = modal.getAttribute("data-type");

      modal.classList.add("show");
      modal.style.display = "flex";
      document.body.style.overflow = "hidden";

      // Handle video iframe initialization
      const iframe = modal.querySelector("iframe");
      if (iframe) {
        const originalSrc = iframe.getAttribute("data-src") || iframe.src;
        iframe.setAttribute("data-src", originalSrc); // Cache the source
        iframe.src = originalSrc;
      }

      // Initialize carousel configuration if applicable
      if (modalType === "carousel") {
        modal.dataset.currentSlide = "0"; // Store index natively on the element
        updateCarousel(modal, 0);
      }
    });
  });

  // Attach close event handlers to all modals
  modals.forEach(modal => {
    // Find either variant of the close button inside this modal
    const closeBtn = modal.querySelector(".close-modal") || modal.querySelector(".close-carousel");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => closeModal(modal));
    }

    // Close modal instantly if the user clicks the dark background overlay
    modal.addEventListener("click", event => {
      if (event.target === modal) {
        closeModal(modal);
      }
    });
  });

  // ==========================================================================
  // 4. CAROUSEL SLIDER LOGIC
  // ==========================================================================
  function scrollCarousel(modal, direction) {
    const track = modal.querySelector(".carousel-track");
    if (!track) return;

    const items = track.children;
    const totalItems = items.length;
    if (totalItems === 0) return;

    // Retrieve this specific modal's current slide index
    let current = parseInt(modal.dataset.currentSlide || 0, 10);

    current += direction;
    if (current < 0) current = totalItems - 1;
    if (current >= totalItems) current = 0;

    // Save the new index back to the modal tracking state
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

  // Bind click listeners to carousel arrows dynamically
  document.querySelectorAll(".modal-carousel").forEach(carousel => {
    const modal = carousel.closest(".modal");
    if (!modal) return;

    const leftArrow = carousel.querySelector(".arrow.left");
    const rightArrow = carousel.querySelector(".arrow.right");

    if (leftArrow) {
      leftArrow.addEventListener("click", () => scrollCarousel(modal, -1));
    }
    if (rightArrow) {
      rightArrow.addEventListener("click", () => scrollCarousel(modal, 1));
    }
  });
});
