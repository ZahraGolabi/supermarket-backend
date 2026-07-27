import { validations } from "../utils/validation.js";
import {
  showSwal,
  saveToLocalStorage,
  getFromLocalstorage,
  getToken,
  fetchAuth,
} from "../utils/utils.js";
import { baseURL } from "../../config.js";

const register = async () => {
  const phoneInput = document.querySelector("#phone");
  if (!validations(phoneInput.value)) {
    showSwal("خطا", "شماره موبایل معتبر نیست.", "error", "متوجه شدم");
    return;
  }
  const newUserInfos = {
    phone: phoneInput.value,
  };
  
  try {
    const response = await fetch(`${baseURL}/auth/register-by-phone`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUserInfos),
      credentials: "include",
    });
    const data = await response.json();
    console.log(response);

    if (response.ok) {
      await showSwal("کد تایید", data.otp, "info", "متوجه شدم");
      saveToLocalStorage("user", { phone: phoneInput.value });
      location.href = "passwordLogin.html";
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

  const response = await fetch(`${baseURL}/auth/verify-by-phone`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInfo),
    credentials: "include",
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
