(() => {
  const carousel = document.querySelector("[data-project-carousel]");
  if (!carousel) return;

  const track = carousel.querySelector("[data-project-track]");
  const slides = Array.from(track?.querySelectorAll(".project-hero") || []);
  const dots = Array.from(carousel.querySelectorAll("[data-project-dot]"));
  const prevButton = carousel.querySelector("[data-project-prev]");
  const nextButton = carousel.querySelector("[data-project-next]");

  if (!track || slides.length === 0 || dots.length === 0) return;

  const scrollToIndex = (index) => {
    const clampedIndex = Math.max(0, Math.min(slides.length - 1, index));
    track.scrollTo({
      left: clampedIndex * track.clientWidth,
      behavior: "smooth",
    });
    setActiveDot(clampedIndex);
    setArrowState(clampedIndex);
  };

  const setActiveDot = (index) => {
    dots.forEach((dot, i) => {
      const isActive = i === index;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  };

  const setArrowState = (index) => {
    if (prevButton) prevButton.disabled = index <= 0;
    if (nextButton) nextButton.disabled = index >= slides.length - 1;
  };

  const activeIndexFromScroll = () => {
    const slideWidth = track.clientWidth || 1;
    const index = Math.round(track.scrollLeft / slideWidth);
    return Math.max(0, Math.min(slides.length - 1, index));
  };

  let rafId = null;
  const syncOnScroll = () => {
    if (rafId !== null) return;
    rafId = window.requestAnimationFrame(() => {
      const index = activeIndexFromScroll();
      setActiveDot(index);
      setArrowState(index);
      rafId = null;
    });
  };

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = Number(dot.getAttribute("data-project-dot"));
      if (!Number.isFinite(index)) return;
      scrollToIndex(index);
    });
  });

  prevButton?.addEventListener("click", () => {
    scrollToIndex(activeIndexFromScroll() - 1);
  });

  nextButton?.addEventListener("click", () => {
    scrollToIndex(activeIndexFromScroll() + 1);
  });

  track.addEventListener("scroll", syncOnScroll, { passive: true });
  window.addEventListener("resize", () => {
    const index = activeIndexFromScroll();
    setActiveDot(index);
    setArrowState(index);
  });

  setActiveDot(0);
  setArrowState(0);
})();
