const btn = document.querySelector(".back-to-top__btn");
const stopSection = document.querySelector(".back-to-top");
const detailProductClose = document.querySelector(".detail-product__close");
const overlay = document.querySelector(".overlay");
const detailProduct = document.querySelector(".detail-product");
const bannerProduct = document.querySelectorAll(
  ".banner-product__image-wapper",
);
const loginBtn = document.querySelector("#login");
const loginBody = document.querySelector(".login__body");

window.addEventListener("scroll", function () {
  const stopSectionRect = stopSection.getBoundingClientRect();
  const btnHeight = btn.offsetHeight;
  if (stopSectionRect.top <= window.innerHeight - btnHeight - 20) {
    btn.style.position = "sticky";
    btn.style.bottom = "20px";
    btn.style.top = "auto";
  } else if (window.scrollY > 300) {
    btn.style.position = "fixed";
    btn.style.bottom = "20px";
    btn.style.left = "20px";
    btn.classList.add("show");
  } else {
    btn.classList.remove("show");
  }
});

const toggleOverlay = (status) => {
  const action = status ? "add" : "remove";
  overlay.classList[action]("overlay--show");
  detailProduct.classList[action]("overlay--show");
  document.body.classList[action]("overlay-open");
};

const openDetail = () => toggleOverlay(true);
const closeDetail = () => toggleOverlay(false);


const loginDrooDownHandler = () => {
  loginBody.classList.toggle("show-panel");
};

bannerProduct.forEach((item) => {
  item.addEventListener("click", openDetail);
});


detailProductClose.addEventListener("click", closeDetail); 


const setupLoginDropdown = () => {
  const loginBtn = document.querySelector("#login");
  const loginBody = document.querySelector(".login__body");

  if (!loginBtn || !loginBody) return;

  loginBtn.addEventListener("click", () => {
    loginBody.classList.toggle("show-panel");
  });
};


document.addEventListener('DOMContentLoaded', function() {
    const loginWrapper = document.querySelector('.login-wrapper');
    const headerLocation = document.querySelector('.header-location');
        function hideInMobile() {
        if (window.innerWidth <= 768) {
            if (loginWrapper) loginWrapper.style.display = 'none';
            if (headerLocation) headerLocation.style.display = 'none';
        }
    }
        window.addEventListener('scroll', hideInMobile);
        window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            if (loginWrapper) loginWrapper.style.display = '';
            if (headerLocation) headerLocation.style.display = '';
        }
    });
});









export { setupLoginDropdown };