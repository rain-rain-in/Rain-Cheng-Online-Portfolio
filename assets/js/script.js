document.addEventListener("DOMContentLoaded", () => {
  // 🌫️ Header background transition on scroll
  const header = document.querySelector(".Header");
  const triggerPoint = document.querySelector("#About").offsetTop;

  window.addEventListener("scroll", () => {
    if (window.scrollY >= triggerPoint - 50) {
      header.style.backgroundColor = "rgba(0, 0, 0, 1)";
    } else {
      header.style.backgroundColor = "rgba(0, 0, 0, 0)";
    }
  });

  // 🖼️ Hover-triggered image swap in About section
  const triggers = document.querySelectorAll(".hover-trigger");
  const image = document.querySelector(".Picture");

  triggers.forEach(trigger => {
    trigger.addEventListener("mouseenter", () => {
      const newSrc = trigger.getAttribute("data-image");
      if (newSrc) {
        image.src = newSrc;
        image.style.opacity = "1";
      }
    });

    trigger.addEventListener("mouseleave", () => {
      image.src = "";
      image.style.opacity = "0";
    });
  });

  // 🔁 Modal Logic
  const workItems = document.querySelectorAll(".work-item");
  const modals = document.querySelectorAll(".modal");

  workItems.forEach(item => {
    item.addEventListener("click", event => {
      event.preventDefault(); // Prevent accidental navigation

      const modalId = item.getAttribute("data-modal");
      const modal = document.getElementById(modalId);
      const modalType = modal.getAttribute("data-type");

      if (!modal) return;

      modal.classList.add("show");
      modal.style.display = "flex";
      document.body.style.overflow = "hidden";

      const iframe = modal.querySelector("iframe");
      if (iframe) {
        const originalSrc = iframe.getAttribute("data-src") || iframe.src;
        iframe.setAttribute("data-src", originalSrc); // ensure it's stored
        iframe.src = originalSrc;
      }

      if (modalType === "carousel") {
        currentSlide = 0;
        updateCarousel(modal);
      }
    });
  });

  // ❌ Close modal
  modals.forEach(modal => {
    const closeBtn = modal.querySelector(".close-modal");

    closeBtn.addEventListener("click", () => {
      modal.classList.remove("show");
      modal.style.display = "none";
      document.body.style.overflow = "";

      const iframe = modal.querySelector("iframe");
      if (iframe) {
        iframe.src = "";
        setTimeout(() => {
          iframe.src = iframe.getAttribute("data-src");
        }, 100);
      }
    });

    // 🖱️ Click outside modal content to close
    modal.addEventListener("click", event => {
      if (event.target === modal) {
        modal.classList.remove("show");
        modal.style.display = "none";
        document.body.style.overflow = "";

        const iframe = modal.querySelector("iframe");
        if (iframe) iframe.src = "";
      }
    });
  });

  // 🎠 Carousel Logic
  let currentSlide = 0;

  function scrollCarousel(modal, direction) {
    const track = modal.querySelector(".carousel-track");
    const items = track.children;
    const totalItems = items.length;

    currentSlide += direction;
    if (currentSlide < 0) currentSlide = totalItems - 1;
    if (currentSlide >= totalItems) currentSlide = 0;

    updateCarousel(modal);
  }

  function updateCarousel(modal) {
    const track = modal.querySelector(".carousel-track");
    const offset = -currentSlide * 100;
    track.style.transform = `translateX(${offset}%)`;
  }

  // 🎯 Arrow Controls
  document.querySelectorAll(".modal-carousel").forEach(carousel => {
    const modal = carousel.closest(".modal");
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
