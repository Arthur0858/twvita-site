document.documentElement.classList.remove("no-js");

const menuButton = document.querySelector("[data-menu-button]");
const nav = document.querySelector("[data-site-nav]");

if (menuButton && nav) {
  const desktopQuery = window.matchMedia("(min-width: 901px)");

  const setMenuState = (isOpen) => {
    const isHidden = !isOpen && !desktopQuery.matches;
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "關閉選單" : "開啟選單");
    nav.setAttribute("aria-hidden", String(isHidden));
    if (isHidden) {
      nav.setAttribute("inert", "");
    } else {
      nav.removeAttribute("inert");
    }
  };

  const closeMenu = () => {
    nav.classList.remove("is-open");
    setMenuState(false);
  };

  setMenuState(nav.classList.contains("is-open"));

  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    setMenuState(isOpen);
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("is-open")) {
      return;
    }
    if (!event.target.closest("[data-site-nav]") && !event.target.closest("[data-menu-button]")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (desktopQuery.matches) {
      closeMenu();
    } else {
      setMenuState(nav.classList.contains("is-open"));
    }
  });
}

const emailAddress = ["vitawaterproof", "gmail.com"].join("@");
const emailParams = new URLSearchParams({
  subject: "臺灣耘達防水工程評估",
  body: [
    "建築類型：",
    "問題位置：",
    "目前狀況：",
    "照片或尺寸：",
    "使用限制：",
    "可聯絡時間：",
  ].join("\n"),
}).toString();

document.querySelectorAll("[data-email-link]").forEach((link) => {
  link.setAttribute("href", `mailto:${emailAddress}?${emailParams}`);
  if (link.dataset.emailLabel === "address") {
    link.textContent = emailAddress;
  }
});

document.querySelectorAll("[data-email-text]").forEach((node) => {
  node.textContent = emailAddress;
});

document.querySelectorAll(".sticky-contact a[href='tel:+886228120021']").forEach((link) => {
  link.textContent = "來電洽詢";
  link.setAttribute("aria-label", "來電洽詢臺灣耘達防水工程");
});
