
const btn = document.querySelector('.back-to-top__btn');
const stopSection = document.querySelector('.back-to-top');
const detailProductClose=document.querySelector(".detail-product__close");
const overlay=document.querySelector(".overlay");
const detailProduct=document.querySelector(".detail-product");


window.addEventListener('scroll', function() {
  const stopSectionRect = stopSection.getBoundingClientRect();
  const btnHeight = btn.offsetHeight;
  if (stopSectionRect.top <= window.innerHeight - btnHeight - 20) {
    btn.style.position = 'sticky';
    btn.style.bottom = '20px';
    btn.style.top = 'auto';
  } 
  else if (window.scrollY > 300) {
    btn.style.position = 'fixed';
    btn.style.bottom = '20px';
    btn.style.left = '20px';
    btn.classList.add('show');
  } 
  else {
    btn.classList.remove('show');
  }
});


const toggleOverlay=(status)=>{
const action =status  ? "add" : "remove"
overlay.classList[action]("overlay--show")
detailProduct.classList[action]("overlay--show")
document.body.classList[action]('overlay-open');
}

const openDetail=()=> toggleOverlay(true)
const closeDetail =()=> toggleOverlay(false)


console.log("test");

// bannerProduct.forEach((item)=>{
//   item.addEventListener("click",openDetail)
// })
detailProductClose.addEventListener("click",closeDetail)


