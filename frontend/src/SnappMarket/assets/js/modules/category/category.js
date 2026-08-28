import { baseURL } from "../../config.js";

const getAndShowcategorys = async () => {
  const categoryWrapper = document.querySelector("#category-wrapper");
  const res = await fetch(`${baseURL}/category/?limit=7&page=1`);
  const categories = await res.json();
  const reversedCategories = [...categories.data].reverse();

  reversedCategories.forEach((categorie) => {
    categoryWrapper.insertAdjacentHTML(
      "beforeend",
      `
        <div class="category-slider__item swiper-slide">
          <a href="">
             <div class="category-slider__media">
               <img
                class="category-slider__image"
                 src="${categorie.image}"
                 alt="محصول1"
                 loading="lazy"
               />
          </div>
          <span class="category-slider__label ellipsis"
            >${categorie.title}</span
          >
         </a>
        </div>
            
       `,
    );
  });

  return categories;
};


const renderDentBanner=async()=>{
  const denetBanerElem=document.querySelector(".denet-baner");
  const res = await fetch(`http://localhost:8000/api/good?limit=8&page=1`);
  const products = await res.json()
  products.data.forEach((product)=>{
    denetBanerElem.insertAdjacentHTML("beforeend",`
         <div
             class="banner-product__info swiper-slide register-section-product"
           >
             <div class="banner-product__image-wapper">
               <span class="banner-product__discount">${product.discountPercent}</span>
               <span class="banner-product__favorite">
                 <svg class="banner-product__icon--favorite">
                   <use href="#like-icon"></use>
                 </svg>
               </span>
               <img
                 class="banner-product__image"
                 src=${product.image}
                 alt="محصول1"
               />
               <div class="banner-product__add-btn">
                 <svg><use href="#pluse"></use></svg>
               </div>
             </div>
             <span
               class="banner-product__title-product section-register-title"
               >${product.title}</span
             >
             <span class="banner-product__price-current"
             >${product.price} تومان</span
             >
             <del class="banner-product__price-old">69,000</del>
       </div>
      `)
  })



}

export { getAndShowcategorys,renderDentBanner };
