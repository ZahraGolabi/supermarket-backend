import { getMe } from "./modules/auth/auth.js";
import { isLogin } from "./modules/utils/utils.js";

// window.addEventListener("load", () => {
//   showUserNameInNavBar();
// });

const showUserNameInNavBar = () => {
  const navBarProfileBox = document.querySelector(".login");
  const isLoginUser = isLogin();
  if (isLoginUser) {
  } else {
    // navBarProfileBox.setAttribute("href","login.html")
    navBarProfileBox.insertAdjacentHTML(
      "beforeend",
      `
       <span class="login__text">عضویت یا ورود </span>
      `,
    );
  }
  const userInfos = getMe().then((data) => {
    console.log(userInfos);
  });
};
showUserNameInNavBar()