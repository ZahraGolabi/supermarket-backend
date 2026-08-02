import { register } from "./auth.js";
import { validations } from "../utils/validation.js";


const registerBtn = document.querySelector("#submit-btn");
const phoneInput = document.querySelector("#phone");

phoneInput.addEventListener("input", () => {
  const inputPhone = validations(phoneInput.value);
  inputPhone
    ? registerBtn.classList.add("valid")
    : registerBtn.classList.remove("valid");
});

registerBtn.addEventListener("click",(event) => {
  event.preventDefault();
  register();
});

