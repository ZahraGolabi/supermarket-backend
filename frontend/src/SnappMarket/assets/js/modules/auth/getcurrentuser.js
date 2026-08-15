import { baseURL } from "../../config.js";
import { fetchApi } from "../utils/utils.js";
import {setupLoginDropdown} from "../../app.js";


window.addEventListener("load", () => {
  showUserNameInNavBar();
});

const showUserNameInNavBar = async () => {
  const navBarProfileBox = document.querySelector(".login");
  const response = await fetchApi(`${baseURL}/users/me`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response) {
    navBarProfileBox.href = "login.html";
    navBarProfileBox.innerHTML = `
      <span class="login__text">عضویت یا ورود</span>
    `;
    return;
  }

  const result = await response.json();
  if (response.ok) {
    navBarProfileBox.style.background = "transparent";
    navBarProfileBox.innerHTML = `
      <i class="fa-solid fa-circle-user"></i>
    `;

    setupLoginDropdown();
  } else {
    navBarProfileBox.href = "login.html";
    navBarProfileBox.innerHTML = `
      <span class="login__text">عضویت یا ورود</span>
    `;
  }
};

export { showUserNameInNavBar };
