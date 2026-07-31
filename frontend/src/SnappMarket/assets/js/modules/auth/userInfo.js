import { getInformationsUser ,getMe } from "./auth.js";
const firstNameInput = document.querySelector("#firstName");
const lastNameInput = document.querySelector("#lastName");
const userSubmitBtn = document.querySelector("#user-submit-Btn");

window.addEventListener("input", () => {
  const lastName = lastNameInput.value.trim();
  const firstName = firstNameInput.value.trim();

  if (lastName && firstName) {
    userSubmitBtn.classList.add("valid");
  }
});

userSubmitBtn.addEventListener("click", (event) => {
  event.preventDefault();
  getInformationsUser().then((result) => {
    getMe()
  });
});
