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

const renderDentBanner = async () => {
  const denetBanerElem = document.querySelector(".denet-baner");
  const res = await fetch(`http://localhost:8000/api/good/?limit=50&page=1`);
  const products = await res.json();
  const danetProduct = products.data
    .filter(
      (product) => product.brandId == "a086c69a-c7df-423c-aafa-bc62626c3746",
    )
    .slice(products.length - 8);
  
  tamplateProduct( danetProduct,denetBanerElem)
};

const renderIceCreame = async () => {
  const iceCreamElem = document.querySelector(".ice-cream-banner");
  const res = await fetch(`http://localhost:8000/api/good`);
  const products = await res.json();
  const iceCremeProduct = products.data
    .filter(
      (product) => product.brandId == "b71a15de-2567-46ec-a896-659407f6eec1",
    )
    .slice(products.length - 8);
    tamplateProduct(iceCremeProduct,iceCreamElem)
};

const renderFresherProduct=async()=>{
    const  fresherProductElem = document.querySelector(".fresher-than");
  const res = await fetch(`http://localhost:8000/api/good`);
  const products = await res.json();
  const fresherProduct = products.data
    .filter(
      (product) => product.brandId == "3480251e-ef7f-4e80-a43b-7edf379c0de6" || product.brandId === "648ccbe3-071d-4379-85d2-5e0c2f504da9",
    )
    .slice(products.length - 8);
    tamplateProduct(fresherProduct,fresherProductElem)

}



const tamplateProduct = (products,container) => {
  products.forEach((product) => {
    container.insertAdjacentHTML(
      "beforeend",
      `
            <div
                    class="banner-product__info swiper-slide register-section-product"
                  >
                    <div class="banner-product__image-wapper">
                      <span class="banner-product__discount">${product.discountPercent ? product.discountPercent : ""}%</span>
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
                      >${product.price}</span
                    >
                    <del class="banner-product__price-old">
                     ${product.discountPercent ? Math.round(product.price / (1 - product.discountPercent / 100)).toLocaleString() + " تومان" : ""}
            </del> 
          </div>
    `,
    );
  });
};




export { getAndShowcategorys, renderDentBanner, renderIceCreame,renderFresherProduct};
