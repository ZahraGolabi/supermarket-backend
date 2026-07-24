import { validations } from "./validation.js";
import {
  showSwal,
  saveToLocalStorage,
  getFromLocalstorage,
  getToken,
} from "./utils.js";

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
      saveToLocalStorage("user", { phone: phoneInput.value });
      window.location.href = "passwordLogin.html";
    }
    return data;
  } catch (error) {
    showSwal("خطا", "مشکل در ارتباط با سرور", "error", "متوجه شدم");
  }
};

const handleOtpVerification = async (otpCode) => {
  const userPhone = getToken();
  const userInfo = {
    phone: userPhone.phone,
    otp: otpCode,
  };

  const baseUrl = "http://localhost:3000/api/auth/verify-by-phone";
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInfo),
  });
  const data = await response.json();
  if (response.ok) {
    await showSwal(
      "موفقیت",
      "ورود شما با موفقیت انجام شد",
      "success",
      "ورود به پنل",
    );
    window.location.href = "index.html";
  } else {
    await showSwal(
      "خطا",
      "کد تایید نامعتبر است یا منقضی شده است",
      "error",
      "تلاش مجدد",
    );
  }
  return data;
};

export { register, handleOtpVerification };
