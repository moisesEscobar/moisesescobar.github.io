/* Moisés Escobar Martínez · Native navigation; content remains readable without JS. */
(() => {
  "use strict";
  const menu = document.getElementById("nav-menu");
  const toggle = document.querySelector(".menu-toggle");
  const header = document.getElementById("header");
  const links = [...menu.querySelectorAll('a[href^="#"]')];
  const mobile = window.matchMedia("(max-width: 900px)");
  document.documentElement.classList.add("js");
  toggle.hidden = !mobile.matches;
  const closeMenu = (restoreFocus = false) => {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    if (restoreFocus) toggle.focus();
  };
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  const markCurrent = (id) => {
    for (const link of links) {
      if (link.hash === `#${id}`) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  };
  for (const link of links) {
    link.addEventListener("click", () => {
      markCurrent(link.hash.slice(1));
      closeMenu();
      const destination = document.getElementById(link.hash.slice(1));
      destination.setAttribute("tabindex", "-1");
      destination.focus({ preventScroll: true });
    });
  }
  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      toggle.getAttribute("aria-expanded") === "true"
    )
      closeMenu(true);
  });
  header.addEventListener("focusout", (event) => {
    if (!header.contains(event.relatedTarget)) closeMenu();
  });
  mobile.addEventListener("change", () => {
    const focusInMenu = menu.contains(document.activeElement);
    toggle.hidden = !mobile.matches;
    closeMenu(mobile.matches && focusInMenu);
  });
  const sections = links.map((link) =>
    document.getElementById(link.hash.slice(1)),
  );
  const backToTop = document.querySelector(".back-to-top");
  let scheduled = false;
  const updateScroll = () => {
    const offset = mobile.matches ? 120 : 100;
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= offset) current = section;
    }
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 2
    )
      current = sections[sections.length - 1];
    markCurrent(current.id);
    backToTop.hidden = window.scrollY < 500;
    scheduled = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!scheduled) {
        scheduled = true;
        window.requestAnimationFrame(updateScroll);
      }
    },
    { passive: true },
  );
  window.addEventListener("resize", updateScroll);
  window.addEventListener("load", updateScroll);
  updateScroll();
  document.getElementById("cyear").textContent = new Date().getFullYear();
  let closedDetails = [];
  window.addEventListener("beforeprint", () => {
    closedDetails = [...document.querySelectorAll("details:not([open])")];
    closedDetails.forEach((detail) => {
      detail.open = true;
    });
  });
  window.addEventListener("afterprint", () => {
    closedDetails.forEach((detail) => {
      detail.open = false;
    });
    closedDetails = [];
  });
})();
