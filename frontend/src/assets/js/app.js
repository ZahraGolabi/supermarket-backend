const navBtn = document.querySelector(".nav__btn");
const navMenuMobile = document.querySelector(".mobile-nav-wrapper");

let navOpen = false;
navBtn.addEventListener("click", () => {
  if (navOpen) {
    navBtn.classList.remove("nav__btn--open");
    navMenuMobile.classList.remove("active");
      document.body.classList.remove("scroll-show")
    navOpen = false;
  } else {
    navBtn.classList.add("nav__btn--open");
    navMenuMobile.classList.add("active");
      document.body.classList.add("scroll-show")
    navOpen = true;
  }
});

document.querySelectorAll(".mobile-nav-item")
  .forEach(
    (item) =>
      item.querySelector("svg") &&
      item.addEventListener("click", () =>
        item.classList.toggle("has-dropdown"),
      ),
  );

