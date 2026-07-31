
import { getInformationsUser } from "./auth.js";


const userSubmitBtn=document.querySelector("#user-submit-Btn")
userSubmitBtn.addEventListener("click",(event)=>{
event.preventDefault()
getInformationsUser().then((result)=>{
console.log(result);

})
})