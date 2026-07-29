
const btn = document.querySelector('.back-to-top__btn');
const stopSection = document.querySelector('.back-to-top');
const detailProductClose=document.querySelector(".detail-product__close");
const overlay=document.querySelector(".overlay");
const detailProduct=document.querySelector(".detail-product");
<<<<<<< HEAD
=======
const bannerProduct=document.querySelectorAll(".banner-product__image-wapper");
const loginBtn=document.querySelector("#login")
const loginBody=document.querySelector(".login__body")
>>>>>>> 4313ff028c008694081b3239a65d0579afa3ba92


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

<<<<<<< HEAD

=======
const loginDrooDownHandler=()=>{
loginBody.classList.toggle("show-panel")
}
>>>>>>> 4313ff028c008694081b3239a65d0579afa3ba92

bannerProduct.forEach((item)=>{
  item.addEventListener("click",openDetail)
})
<<<<<<< HEAD
detailProductClose.addEventListener("click",closeDetail)

=======


detailProductClose.addEventListener("click",closeDetail)
loginBtn.addEventListener("click",loginDrooDownHandler)
>>>>>>> 4313ff028c008694081b3239a65d0579afa3ba92

