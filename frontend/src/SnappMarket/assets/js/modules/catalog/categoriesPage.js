import {
  categoryImage,
  formatPrice,
  getBrandsByCategory,
  getCategories,
  getFinalPrice,
  getProducts,
  productImage,
} from "./api.js";

const state = {
  categories: [],
  brands: [],
  products: [],
  selectedCategoryId: "",
  selectedBrandId: "",
  categorySwiper: null,
  filterSwiper: null,
};

const getQueryParam = (key) => new URLSearchParams(window.location.search).get(key);

const setQueryParam = (key, value) => {
  const url = new URL(window.location.href);
  if (value) {
    url.searchParams.set(key, value);
  } else {
    url.searchParams.delete(key);
  }
  window.history.replaceState({}, "", url);
};

const productSliderOptions = {
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
    0: { slidesPerView: 2.2, spaceBetween: 6, centeredSlides: false },
    480: { slidesPerView: 2.8, spaceBetween: 8, centeredSlides: false },
    576: { slidesPerView: 3.2, spaceBetween: 8, centeredSlides: false },
    768: { slidesPerView: 4.2, spaceBetween: 10, centeredSlides: false },
    992: { slidesPerView: 5.2, spaceBetween: 12, centeredSlides: false },
    1200: { slidesPerView: "auto", spaceBetween: 5, centeredSlides: false },
  },
};

const initOrUpdateSwiper = (selector, instanceKey, options) => {
  const element = document.querySelector(selector);
  if (!element) {
    return null;
  }

  if (state[instanceKey]) {
    state[instanceKey].destroy(true, true);
    state[instanceKey] = null;
  }

  state[instanceKey] = new Swiper(selector, options);
  return state[instanceKey];
};

const renderCategorySlider = () => {
  const wrapper = document.getElementById("category-slider-list");
  if (!wrapper) {
    return;
  }

  if (!state.categories.length) {
    wrapper.innerHTML = `
      <div class="category-slider__item swiper-slide">
        <span class="category-slider__label ellipsis">دسته‌بندی‌ای ثبت نشده است</span>
      </div>
    `;
    return;
  }

  wrapper.innerHTML = state.categories
    .map((category) => {
      const isActive = category.id === state.selectedCategoryId;
      return `
        <div class="category-slider__item swiper-slide${isActive ? " category-slider__item--active" : ""}">
          <a href="CategoriesPage.html?category=${category.id}" data-category-id="${category.id}">
            <div class="category-slider__media">
              <img
                class="category-slider__image"
                src="${categoryImage(category)}"
                alt="${category.title}"
                loading="lazy"
              />
            </div>
            <span class="category-slider__label ellipsis">${category.title}</span>
          </a>
        </div>
      `;
    })
    .join("");

  initOrUpdateSwiper(".category-slider .product-slider", "categorySwiper", productSliderOptions);
};

const renderBrandFilter = () => {
  const wrapper = document.getElementById("category-filter-list");
  const section = document.querySelector(".category-filter");
  if (!wrapper || !section) {
    return;
  }

  if (!state.selectedCategoryId || !state.brands.length) {
    section.style.display = state.brands.length ? "" : "none";
    wrapper.innerHTML = state.brands.length
      ? ""
      : `<div class="category-slider__wapper-item swiper-slide">
          <span class="category-filter__item filter-bar__item--active">همه</span>
        </div>`;
    return;
  }

  section.style.display = "";

  const allItem = `
    <div class="category-slider__wapper-item swiper-slide">
      <button type="button" class="category-filter__item${state.selectedBrandId ? "" : " filter-bar__item--active"}" data-brand-id="">
        همه
      </button>
    </div>
  `;

  const brandItems = state.brands
    .map((brand) => {
      const isActive = brand.id === state.selectedBrandId;
      return `
        <div class="category-slider__wapper-item swiper-slide">
          <button
            type="button"
            class="category-filter__item${isActive ? " filter-bar__item--active" : ""}"
            data-brand-id="${brand.id}"
          >
            ${brand.name}
          </button>
        </div>
      `;
    })
    .join("");

  wrapper.innerHTML = allItem + brandItems;

  wrapper.querySelectorAll("[data-brand-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedBrandId = button.dataset.brandId || "";
      renderBrandFilter();
      loadProducts();
    });
  });

  initOrUpdateSwiper(".category-filter__container", "filterSwiper", productSliderOptions);
};

const renderProductCard = (product) => {
  const finalPrice = getFinalPrice(product);
  const hasDiscount = product.discountPercent > 0;

  return `
    <div class="banner-product__info product-card__item" data-product-id="${product.id}">
      <div class="banner-product__image-wapper product-card__image">
        ${hasDiscount ? `<span class="banner-product__discount">${product.discountPercent}%</span>` : ""}
        <span class="banner-product__favorite">
          <svg class="banner-product__icon--favorite">
            <use href="#like-icon"></use>
          </svg>
        </span>
        <img
          class="banner-product__image"
          src="${productImage(product)}"
          alt="${product.title}"
          loading="lazy"
        />
        <div class="banner-product__add-btn">
          <svg><use href="#pluse"></use></svg>
        </div>
      </div>
      <span class="banner-product__title-product section-register-title">${product.title}</span>
      <span class="banner-product__price-current">${formatPrice(finalPrice)}</span>
      ${hasDiscount ? `<del class="banner-product__price-old">${formatPrice(product.price)}</del>` : ""}
    </div>
  `;
};

const renderProducts = () => {
  const wrapper = document.getElementById("product-list");
  const emptyState = document.getElementById("product-empty");
  if (!wrapper) {
    return;
  }

  if (!state.products.length) {
    wrapper.innerHTML = "";
    if (emptyState) {
      emptyState.hidden = false;
    }
    return;
  }

  if (emptyState) {
    emptyState.hidden = true;
  }

  wrapper.innerHTML = state.products.map(renderProductCard).join("");
};

const showPageError = (message) => {
  const wrapper = document.getElementById("product-list");
  if (wrapper) {
    wrapper.innerHTML = `<p class="categories-page__error">${message}</p>`;
  }
};

const loadBrands = async () => {
  if (!state.selectedCategoryId) {
    state.brands = [];
    renderBrandFilter();
    return;
  }

  state.brands = await getBrandsByCategory(state.selectedCategoryId);
  renderBrandFilter();
};

const loadProducts = async () => {
  const loading = document.getElementById("product-loading");
  if (loading) {
    loading.hidden = false;
  }

  try {
    state.products = await getProducts({
      categoryId: state.selectedCategoryId,
      brandId: state.selectedBrandId,
      limit: 60,
    });
    renderProducts();
  } catch (error) {
    showPageError(error.message || "خطا در بارگذاری محصولات");
  } finally {
    if (loading) {
      loading.hidden = true;
    }
  }
};

const bootstrapCategoriesPage = async () => {
  const loading = document.getElementById("product-loading");
  if (loading) {
    loading.hidden = false;
  }

  try {
    state.categories = await getCategories(1, 100);
    state.selectedCategoryId =
      getQueryParam("category") || state.categories[0]?.id || "";

    if (state.selectedCategoryId) {
      setQueryParam("category", state.selectedCategoryId);
    }

    renderCategorySlider();
    await loadBrands();
    await loadProducts();
  } catch (error) {
    showPageError(error.message || "خطا در بارگذاری صفحه دسته‌بندی");
  } finally {
    if (loading) {
      loading.hidden = true;
    }
  }
};

document.addEventListener("DOMContentLoaded", bootstrapCategoriesPage);
