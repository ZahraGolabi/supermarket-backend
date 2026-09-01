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



export {
  getAndShowcategorys,
};
