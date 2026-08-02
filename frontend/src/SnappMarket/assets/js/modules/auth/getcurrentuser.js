import { baseURL } from "../../config.js";
import { fetchApi } from "../utils/utils.js";
import {setupLoginDropdown} from "../../app.js";

window.addEventListener("load", () => {
  showUserNameInNavBar();
});

const showUserNameInNavBar = async () => {
  const navBarProfileBox = document.querySelector(".login");
  const respone = await fetchApi(`${baseURL}/users/me`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const result = await respone.json();
  if (respone.ok) {
    navBarProfileBox.style.background = "transparent";
    navBarProfileBox.innerHTML = `
    <i class="fa-solid fa-circle-user"></i>
  `;
    setupLoginDropdown();
  } else {
    navBarProfileBox.href = "login.html";
    navBarProfileBox.innerHTML = `
    <span class="login__text">عضویت یا ورود</span>`;
  }
  console.log(respone);
  console.log(result);
};
