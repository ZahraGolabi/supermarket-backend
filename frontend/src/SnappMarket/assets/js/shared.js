import { getMe } from "./modules/auth/auth.js";
import { isLogin } from "./modules/utils/utils.js";

window.addEventListener("load", () => {
  showUserNameInNavBar();
});

const showUserNameInNavBar = async () => {
  const navBarProfileBox = document.querySelector(".login");
  const isLoginUser = await isLogin();
console.log("isLoginUser:", isLoginUser);
if (isLoginUser) {
  navBarProfileBox.href = "index.html";
  navBarProfileBox.style.background = "transparent";

  navBarProfileBox.innerHTML = `
    <i class="fa-solid fa-circle-user"></i>
  `;
} else {
  navBarProfileBox.href = "login.html";

  navBarProfileBox.innerHTML = `
    <span class="login__text">عضویت یا ورود</span>
  `;
}
};
