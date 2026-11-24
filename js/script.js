document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelectorAll(".nav__link");

  // Открытие/закрытие мобильного меню
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  // Lightbox (работает и с горизонтальной галереей, и с сеткой портфолио)
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const lightboxImg = document.getElementById("lightboxImage");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const lightboxClose = document.getElementById("lightboxClose");
    const lightboxViewport = document.getElementById("lightboxViewport");
    const zoomReset = document.getElementById("lightboxZoomReset");

    const items = Array.from(
      document.querySelectorAll(".gallery__item, .portfolio__item")
    ).filter((item) => item.querySelector("img"));
    const images = items.map((item) => item.querySelector("img"));

    let activeImageIndex = 0;
    let zoom = 1;
    let previousBodyOverflow = "";

    const setZoom = (value) => {
      zoom = Math.min(3, Math.max(1, value));
      if (zoomReset) zoomReset.textContent = `${Math.round(zoom * 100)}%`;
      if (!lightboxImg || !lightboxViewport || !lightboxImg.naturalWidth || !lightboxViewport.clientWidth) return;

      const fitScale = Math.min(
        lightboxViewport.clientWidth / lightboxImg.naturalWidth,
        lightboxViewport.clientHeight / lightboxImg.naturalHeight,
        1
      );
      lightboxImg.style.transform = `scale(${fitScale * zoom})`;
      lightboxImg.style.transformOrigin = "center center";
    };

    const showImage = (index) => {
      if (!images.length) return;
      activeImageIndex = (index + images.length) % images.length;
      const img = images[activeImageIndex];
      if (lightboxViewport) lightboxViewport.scrollTo(0, 0);
      lightboxImg.onload = () => setZoom(zoom);
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = img.alt;
      setZoom(1);
    };

    items.forEach((item, index) => {
      item.addEventListener("click", () => {
        previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        showImage(index);
        if (typeof lightbox.showModal === "function") lightbox.showModal();
      });
    });

    const showPreviousImage = () => showImage(activeImageIndex - 1);
    const showNextImage = () => showImage(activeImageIndex + 1);

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
    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    const bind = (id, handler) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("click", handler);
    };
    bind("lightboxPrev", showPreviousImage);
    bind("lightboxNext", showNextImage);
    bind("lightboxZoomOut", () => setZoom(zoom - 0.25));
    bind("lightboxZoomIn", () => setZoom(zoom + 0.25));
    bind("lightboxZoomReset", () => setZoom(1));

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
  }

  // Горизонтальная прокрутка галереи (только если она есть на странице)
  const gallery = document.getElementById("galleryGrid");
  if (gallery) {
    const galleryPrev = document.getElementById("galleryPrev");
    const galleryNext = document.getElementById("galleryNext");
    if (galleryPrev) {
      galleryPrev.addEventListener("click", () => {
        gallery.scrollBy({ left: -gallery.clientWidth * 0.8, behavior: "smooth" });
      });
    }
    if (galleryNext) {
      galleryNext.addEventListener("click", () => {
        gallery.scrollBy({ left: gallery.clientWidth * 0.8, behavior: "smooth" });
      });
    }
  }

  // Плавный скролл к якорям с учетом фиксированной шапки
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const header = document.getElementById("header");
      const headerHeight = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
});