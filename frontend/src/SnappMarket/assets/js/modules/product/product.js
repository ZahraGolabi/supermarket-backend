const renderDentBanner = async () => {
  const denetBanerElem = document.querySelector(".denet-baner");
  const res = await fetch(`http://localhost:8000/api/good/?limit=50&page=1`);
  const products = await res.json();
  const danetProduct = products.data
    .filter(
      (product) => product.brandId == "a086c69a-c7df-423c-aafa-bc62626c3746",
    )
    .slice(products.length - 8);
  tamplateProduct(danetProduct, denetBanerElem);
};

const renderIceCreame = async () => {
  const iceCreamElem = document.querySelector(".ice-cream-banner");
  const res = await fetch(`http://localhost:8000/api/good/?limit=50&page=1`);
  const products = await res.json();
  const iceCremeProduct = products.data
    .filter(
      (product) => product.brandId === "b71a15de-2567-46ec-a896-659407f6eec1",
    )
    .slice(products.length - 8);
  tamplateProduct(iceCremeProduct, iceCreamElem);
};

const renderFresherProduct = async () => {
  const fresherProductElem = document.querySelector(".fresher-than");
  const res = await fetch(`http://localhost:8000/api/good`);
  const products = await res.json();
  const fresherProduct = products.data
    .filter(
      (product) =>
        product.brandId == "3480251e-ef7f-4e80-a43b-7edf379c0de6" ||
        product.brandId === "648ccbe3-071d-4379-85d2-5e0c2f504da9",
    )
    .slice(products.length - 8);
  tamplateProduct(fresherProduct, fresherProductElem);
};

const prepareQuickly = async () => {
  const bannerWrapper = document.querySelector(".banner-product__quickly");
  const res = await fetch(`http://localhost:8000/api/good/`);
  const products = await res.json();

  const mainProduct = products.data
    .filter(
      (product) =>
        product.categoryId == "7444840d-ac98-4c99-893b-22876d0b7b10" ||
        product.categoryId == "9c79df77-20dd-4e0c-8733-9e10074f57a6",
    )
    .splice(products.length - 8);

  tamplateProduct(mainProduct, bannerWrapper);
};

const renderBrandBanner = async () => {
  const productWrapper = document.querySelector(".brande-wrapper");
  const res = await fetch(`http://127.0.0.1:8000/api/brand/?limit=50&page=1`);
  const products = await res.json();
  const drinkBrannd = products.data
    .filter(
      (product) => product.categoryId == "04789251-b3ca-4f35-ab5c-fda0acf888a5",
    )
    .slice(products.length - 5);
  drinkBrannd.forEach((brand) => {
    productWrapper.insertAdjacentHTML(
      "beforeend",
      `
               <div class="category-slider__item swiper-slide">
                <a href="">
                  <div class="category-slider__media">
                    <img
                      class="category-slider__image"
                      src=${brand.image}
                      alt="محصول1"
                      loading="lazy"
                    />
                  </div>
                  <span class="category-slider__label ellipsis">${brand.name}</span>
                </a>
              </div>
        `,
    );
  });
};

// const goToDetail=async(productID)=>{
//   const res = await fetch(`http://localhost:8000/api/good/${productID}`);
//   const detailsProduct=await res.json()
//   const test=document.querySelector(".detail-product")
//   const overlay=document.querySelector(".overlay")

// const detailProductImage=document.querySelector(".detail-product__image")
// const detailProductStock=document.querySelector(".detail-product__stock")
//   const detailProducTitle=document.querySelector(".detail-product__title")
// const detailProductSaving=document.querySelector(".detail-product__saving")

// const detailProductPriceCurrent=document.querySelector(".detail-product__price-current")
// const detailProductPriceOld=document.querySelector(".detail-product__price-old")
// const detailProductDiscountBadge=document.querySelector(".detail-product__discount-badge")

//   if(res.status==200){
//   test.classList.add("overlay--show");
//   document.body.classList.add("overlay-open");
//   overlay.classList.add("overlay--show");

// detailProductImage.setAttribute("src",detailsProduct.image)
// detailProductStock.innerHTML=`${detailsProduct.stockQuantity} عدد مانده !`
// detailProducTitle.innerHTML=detailsProduct.title
// detailProductSaving.innerHTML=`با خرید هر عدد ۲۶۲,۵۰۰ تومان صرفه جویی کنید!`
// detailProductPriceCurrent.innerHTML=`${detailsProduct.price} تومان`
// // detailProductPriceOld.innerHTML=""
// detailProductDiscountBadge.innerHTML=`${detailsProduct.discountPercent} %`

//   }

//   console.log(res);
//   console.log(detailsProduct);

// console.log(productID);

// }

const goToDetail = async (productID) => {
  const res = await fetch(`http://localhost:8000/api/good/${productID}`);
  const product = await res.json();
  if (res.status !== 200) return;

  const elements = getElements();
  fillProductData(elements, product);

  showModal(elements);
  elements.close.addEventListener(
    "click",
    () => {
      hideModal(elements)();
    },
    { once: true },
  );
};

const getElements = () => ({
  modal: document.querySelector(".detail-product"),
  close: document.querySelector(".detail-product__close"),
  overlay: document.querySelector(".overlay"),
  image: document.querySelector(".detail-product__image"),
  stock: document.querySelector(".detail-product__stock"),
  title: document.querySelector(".detail-product__title"),
  saving: document.querySelector(".detail-product__saving"),
  priceCurrent: document.querySelector(".detail-product__price-current"),
  priceOld: document.querySelector(".detail-product__price-old"),
  discount: document.querySelector(".detail-product__discount-badge"),
});

const showModal = (elements) => {
  elements.modal.classList.add("overlay--show");
  elements.overlay.classList.add("overlay--show");
  document.body.classList.add("overlay-open");
};

const hideModal = (elements) => () => {
  elements.modal.classList.remove("overlay--show");
  elements.overlay.classList.remove("overlay--show");
  document.body.classList.remove("overlay-open");
};

const calculateOldPrice = (price, discountPercent) => {
  if (discountPercent <= 0) return null;
  return Math.round(price / (1 - discountPercent / 100));
};

const calculateSaving = (oldPrice, price) => {
  return oldPrice ? oldPrice - price : 0;
};

const fillProductData = (elements, product) => {
  console.log(elements, product);

  const { image, stock, title, saving, priceCurrent, priceOld, discount } =
    elements;
  const {
    image: productImage,
    stockQuantity,
    title: productTitle,
    price,
    discountPercent,
  } = product;

  image.src = productImage;
  stock.innerHTML = `${stockQuantity} عدد مانده !`;
  title.innerHTML = productTitle;
  priceCurrent.innerHTML = price.toLocaleString() + " تومان";
  discount.innerHTML = `${discountPercent} %`;
  const oldPrice = calculateOldPrice(price, discountPercent);
  if (oldPrice) {
    const savingAmount = calculateSaving(oldPrice, price);
    saving.innerHTML = `با خرید هر عدد ${savingAmount.toLocaleString()} تومان صرفه جویی کنید!`;
  }
};

const tamplateProduct = (products, container) => {
  products.forEach((product) => {
    container.insertAdjacentHTML(
      "beforeend",
      `
            <div
                    class="banner-product__info swiper-slide register-section-product"
                    onclick=goToDetail('${product.id}')
                  >
                    <div class="banner-product__image-wapper">
                    ${
                      product.discountPercent
                        ? `<span class="banner-product__discount">${product.discountPercent}%</span>`
                        : ""
                    }
                      
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

export {
  renderDentBanner,
  renderIceCreame,
  renderFresherProduct,
  prepareQuickly,
  renderBrandBanner,
  goToDetail,
};
