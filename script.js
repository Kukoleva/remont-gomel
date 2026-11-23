document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelectorAll(".nav__link");

  // Открытие/закрытие мобильного выпадающего меню
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  // Закрытие меню при клике на ссылку
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });

  // Lightbox для галереи
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");
  const galleryImages = document.querySelectorAll(".gallery__item img");
  const galleryItems = document.querySelectorAll(".gallery__item");
  const gallery = document.getElementById("galleryGrid");
  const lightboxViewport = document.getElementById("lightboxViewport");
  const zoomReset = document.getElementById("lightboxZoomReset");
  let activeImageIndex = 0;
  let zoom = 1;
  let previousBodyOverflow = "";

  const setZoom = (value) => {
    zoom = Math.min(3, Math.max(1, value));
    zoomReset.textContent = `${Math.round(zoom * 100)}%`;

    if (!lightboxImg.naturalWidth || !lightboxViewport.clientWidth) return;

    const fitScale = Math.min(
      lightboxViewport.clientWidth / lightboxImg.naturalWidth,
      lightboxViewport.clientHeight / lightboxImg.naturalHeight,
      1
    );
    const scale = fitScale * zoom;
    lightboxImg.style.transform = `scale(${scale})`;
    lightboxImg.style.transformOrigin = "center center";
  };

  const showImage = (index) => {
    activeImageIndex = (index + galleryImages.length) % galleryImages.length;
    const img = galleryImages[activeImageIndex];
    lightboxViewport.scrollTo(0, 0);
    lightboxImg.onload = () => setZoom(zoom);
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = img.alt;
    setZoom(1);
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      showImage(index);
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      lightbox.showModal();
    });
  });

  document.getElementById("galleryPrev").addEventListener("click", () => {
    gallery.scrollBy({ left: -gallery.clientWidth * 0.8, behavior: "smooth" });
  });
  document.getElementById("galleryNext").addEventListener("click", () => {
    gallery.scrollBy({ left: gallery.clientWidth * 0.8, behavior: "smooth" });
  });

  const showPreviousImage = () => showImage(activeImageIndex - 1);
  const showNextImage = () => showImage(activeImageIndex + 1);
  document.getElementById("lightboxPrev").addEventListener("click", showPreviousImage);
  document.getElementById("lightboxNext").addEventListener("click", showNextImage);
  document.getElementById("lightboxZoomOut").addEventListener("click", () => setZoom(zoom - 0.25));
  document.getElementById("lightboxZoomIn").addEventListener("click", () => setZoom(zoom + 0.25));
  document.getElementById("lightboxZoomReset").addEventListener("click", () => setZoom(1));

  const closeLightbox = () => {
    if (lightbox.open) lightbox.close();
  };

  lightbox.addEventListener("close", () => {
    document.body.style.overflow = previousBodyOverflow;
  });
  lightbox.addEventListener("cancel", (e) => {
    e.preventDefault();
    closeLightbox();
  });
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.open) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeLightbox();
      return;
    }
    if (e.key === "ArrowLeft") showPreviousImage();
    if (e.key === "ArrowRight") showNextImage();
    if (e.key === "+" || e.key === "=") setZoom(zoom + 0.25);
    if (e.key === "-") setZoom(zoom - 0.25);
    if (e.key === "0") setZoom(1);
  });

  window.addEventListener("resize", () => {
    if (lightbox.open) setZoom(zoom);
  });

  // Плавный скролл к секциям с учетом фиксированной шапки
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = document.getElementById("header").offsetHeight;
        const targetPosition =
          target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
        window.scrollTo({ top: targetPosition, behavior: "smooth" });
      }
    });
  });
});