(function () {
  const STYLE_KEY = "portfolio-style-option";
  const LAYOUT_KEY = "portfolio-layout-option";
  const DEFAULT_STYLE = "zen";
  const DEFAULT_LAYOUT = "top";

  const STYLE_CLASSES = ["style-zen", "style-wabi", "style-editorial", "style-ma"];
  const LAYOUT_CLASSES = ["layout-top", "layout-left", "layout-journal", "layout-showcase"];

  const menu = document.querySelector("[data-style-menu]");
  const toggle = document.querySelector("[data-style-toggle]");
  const styleButtons = Array.from(document.querySelectorAll("[data-style-option]"));
  const layoutButtons = Array.from(document.querySelectorAll("[data-layout-option]"));

  if (!menu || !toggle || !styleButtons.length || !layoutButtons.length) return;

  const styleToClass = {
    zen: "style-zen",
    wabi: "style-wabi",
    editorial: "style-editorial",
    ma: "style-ma",
  };

  const layoutToClass = {
    top: "layout-top",
    left: "layout-left",
    journal: "layout-journal",
    showcase: "layout-showcase",
  };

  const setActiveButtons = (buttons, key, value) => {
    buttons.forEach((button) => {
      const isActive = button.dataset[key] === value;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-checked", isActive ? "true" : "false");
    });
  };

  const applyStyle = (style, persist) => {
    const next = styleToClass[style] ? style : DEFAULT_STYLE;
    document.body.classList.remove(...STYLE_CLASSES);
    document.body.classList.add(styleToClass[next]);
    setActiveButtons(styleButtons, "styleOption", next);

    if (persist) {
      try {
        localStorage.setItem(STYLE_KEY, next);
      } catch (_) {}
    }
  };

  const applyLayout = (layout, persist) => {
    const next = layoutToClass[layout] ? layout : DEFAULT_LAYOUT;
    document.body.classList.remove(...LAYOUT_CLASSES);
    document.body.classList.add(layoutToClass[next]);
    setActiveButtons(layoutButtons, "layoutOption", next);

    if (persist) {
      try {
        localStorage.setItem(LAYOUT_KEY, next);
      } catch (_) {}
    }
  };

  const closeMenu = () => {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    menu.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
  };

  let savedStyle = DEFAULT_STYLE;
  let savedLayout = DEFAULT_LAYOUT;

  try {
    savedStyle = localStorage.getItem(STYLE_KEY) || DEFAULT_STYLE;
  } catch (_) {}

  try {
    savedLayout = localStorage.getItem(LAYOUT_KEY) || DEFAULT_LAYOUT;
  } catch (_) {}

  applyStyle(savedStyle, false);
  applyLayout(savedLayout, false);

  toggle.addEventListener("click", () => {
    if (menu.classList.contains("open")) closeMenu();
    else openMenu();
  });

  styleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyStyle(button.dataset.styleOption || DEFAULT_STYLE, true);
    });
  });

  layoutButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyLayout(button.dataset.layoutOption || DEFAULT_LAYOUT, true);
    });
  });

  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target)) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
})();
