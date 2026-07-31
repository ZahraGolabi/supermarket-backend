import { validations } from "../utils/validation.js";
import {
  showSwal,
  saveToLocalStorage,
  getFromLocalstorage,
  getLocalstorage,
} from "../utils/utils.js";
import { baseURL } from "../../config.js";
console.log("hi");

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
  const userPhone =getLocalstorage();
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
    const result = await showSwal(
      "موفقیت",
      "ورود شما با موفقیت انجام شد",
      "success",
      "ورود به پنل",
    );
  location.href = "index.html";
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

const getMe=()=>{
const token=getLocalstorage()
console.log(token);

}
getMe()
export { register, handleOtpVerification };
