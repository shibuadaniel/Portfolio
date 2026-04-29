(() => {
  const root = document.querySelector("[data-carousel]");
  if (!root) return;

  const track = root.querySelector("[data-carousel-track]");
  const slides = Array.from(root.querySelectorAll("[data-carousel-slide]"));
  const dots = Array.from(root.querySelectorAll("[data-carousel-dot]"));
  const prevBtn = root.querySelector("[data-carousel-prev]");
  const nextBtn = root.querySelector("[data-carousel-next]");

  if (!track || slides.length === 0 || dots.length === 0) return;

  const clampIndex = (i) =>
    Math.max(0, Math.min(slides.length - 1, i));

  /** Distance between slide starts (handles subpixel layout) */
  const slideStride = () => {
    if (slides.length < 2) return track.clientWidth || 1;
    return slides[1].offsetLeft - slides[0].offsetLeft || track.clientWidth || 1;
  };

  const activeIndexFromScroll = () => {
    const stride = slideStride();
    return clampIndex(Math.round(track.scrollLeft / stride));
  };

  /** Mobile: keep arrow overlay height in sync with stretched hero media */
  const syncNavBand = () => {
    const i = activeIndexFromScroll();
    const slide = slides[i] ?? slides[0];
    const media = slide?.querySelector(".project-hero-media");
    if (!media) return;
    const h = media.getBoundingClientRect().height;
    if (h > 0) root.style.setProperty("--pc-nav-band", `${Math.round(h)}px`);
  };

  const goToSlide = (index, smooth) => {
    const i = clampIndex(index);
    const slide = slides[i];
    if (!slide) return;

    /* scrollIntoView() walks ancestor scrollers and causes peek / “nested” scroll bugs */
    track.scrollTo({
      left: slide.offsetLeft,
      behavior: smooth ? "smooth" : "auto",
    });

    dots.forEach((dot, di) => {
      const on = di === i;
      dot.classList.toggle("is-active", on);
      dot.setAttribute("aria-selected", on ? "true" : "false");
    });

    if (prevBtn) prevBtn.disabled = i <= 0;
    if (nextBtn) nextBtn.disabled = i >= slides.length - 1;

    requestAnimationFrame(syncNavBand);
  };

  let raf = null;
  const onScroll = () => {
    if (raf !== null) return;
    raf = requestAnimationFrame(() => {
      const i = activeIndexFromScroll();
      dots.forEach((dot, di) => {
        const on = di === i;
        dot.classList.toggle("is-active", on);
        dot.setAttribute("aria-selected", on ? "true" : "false");
      });
      if (prevBtn) prevBtn.disabled = i <= 0;
      if (nextBtn) nextBtn.disabled = i >= slides.length - 1;
      syncNavBand();
      raf = null;
    });
  };

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const i = Number(dot.getAttribute("data-carousel-dot"));
      if (Number.isFinite(i)) goToSlide(i, true);
    });
  });

  prevBtn?.addEventListener("click", () => {
    goToSlide(activeIndexFromScroll() - 1, true);
  });

  nextBtn?.addEventListener("click", () => {
    goToSlide(activeIndexFromScroll() + 1, true);
  });

  track.addEventListener("scroll", onScroll, { passive: true });

  window.addEventListener("resize", () => {
    goToSlide(activeIndexFromScroll(), false);
    requestAnimationFrame(syncNavBand);
  });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      goToSlide(0, false);
      syncNavBand();
    });
  });
})();
