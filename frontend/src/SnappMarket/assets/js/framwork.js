const swiper = new Swiper(".swiper-main__baner", {
  slidesPerView: "auto",
  centeredSlides: true,
  spaceBetween: 16,
  loop: false,

  pagination: {
    el: ".swiper-pagination",
  },

  scrollbar: {
    el: ".swiper-scrollbar",
  },
  autoplay: {
    delay: 3500,
  },

  breakpoints: {
    0: {
      slidesPerView: 1,
      spaceBetween: 8,
      centeredSlides: false,
    },
    576: {
      slidesPerView: 1.2,
      spaceBetween: 10,
      centeredSlides: true,
    },
    768: {
      slidesPerView: 1.5,
      spaceBetween: 12,
      centeredSlides: true,
    },
    1024: {
      slidesPerView: "auto",
      spaceBetween: 16,
      centeredSlides: true,
    },
  },
});

const productSwiper = new Swiper(".product-slider", {
  slidesPerView: "auto",
  spaceBetween: 5,
  mousewheel: false,
  freeMode: false,
  loop: false,
  autoplay: false,
  speed: 300,
  effect: "slide",
  centeredSlides: false,
  watchSlidesProgress: false,

  breakpoints: {
    0: {
      slidesPerView: 2.2,
      spaceBetween: 6,
      centeredSlides: false,
    },
    480: {
      slidesPerView: 2.8,
      spaceBetween: 8,
      centeredSlides: false,
    },
    576: {
      slidesPerView: 3.2,
      spaceBetween: 8,
      centeredSlides: false,
    },
    768: {
      slidesPerView: 4.2,
      spaceBetween: 10,
      centeredSlides: false,
    },
    992: {
      slidesPerView: 5.2,
      spaceBetween: 12,
      centeredSlides: false,
    },
    1200: {
      slidesPerView: "auto",
      spaceBetween: 5,
      centeredSlides: false,
    },
  },
});

const customeSwiper = new Swiper(".custom-swiper", {
  slidesPerView: "auto",
  centeredSlides: true,
  spaceBetween: 16,
  loop: false,

  pagination: {
    el: ".swiper-pagination",
  },

  scrollbar: {
    el: ".swiper-scrollbar",
  },
  autoplay: {
    delay: 3500,
  },

  breakpoints: {
    0: {
      slidesPerView: 1,
      spaceBetween: 8,
      centeredSlides: false,
    },
    576: {
      slidesPerView: 1.2,
      spaceBetween: 12,
      centeredSlides: true,
    },
    768: {
      slidesPerView: 1.5,
      spaceBetween: 14,
      centeredSlides: true,
    },
    992: {
      slidesPerView: "auto",
      spaceBetween: 16,
      centeredSlides: true,
    },
  },
});

const largSwiper = new Swiper(".larg-swiper", {
  slidesPerView: 1.2,
  centeredSlides: true,
  spaceBetween: 16,
  loop: false,

  pagination: {
    el: ".banner-slider__pagination",
  },

  autoplay: {
    delay: 3500,
  },

  breakpoints: {
    0: {
      slidesPerView: 1.1,
      spaceBetween: 8,
      centeredSlides: true,
    },
    576: {
      slidesPerView: 1.2,
      spaceBetween: 12,
      centeredSlides: true,
    },
    768: {
      slidesPerView: 1.3,
      spaceBetween: 14,
      centeredSlides: true,
    },
    992: {
      slidesPerView: 1.4,
      spaceBetween: 16,
      centeredSlides: true,
    },
    1200: {
      slidesPerView: 1.5,
      spaceBetween: 20,
      centeredSlides: true,
    },
  },
});
