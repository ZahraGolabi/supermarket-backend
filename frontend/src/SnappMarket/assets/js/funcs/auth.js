import { validations } from "./validation.js";
import { showSwal } from "./utils.js";

const register = async () => {
  const phoneInput = document.querySelector("#phone");
  if (!validations(phoneInput.value)) {
    showSwal("خطا", "شماره موبایل معتبر نیست.", "error", "متوجه شدم");
    return;
  }
  const newUserInfos = {
    phone: phoneInput.value,
  };

  const baseUrl = "http://localhost:3000/api/auth/register-by-phone";
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUserInfos),
    });
    const data = await response.json();
    if (response.ok) {
    await showSwal("کد تایید", data.otp, "info", "متوجه شدم");
      window.location.href = "passwordLogin.html";
    }
    console.log(response);
    console.log(data);
    return data;
  } catch (error) {
    showSwal("خطا", "مشکل در ارتباط با سرور", "error", "متوجه شدم");
  }
};

export { register };
