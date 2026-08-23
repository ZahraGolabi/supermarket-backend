import { validations } from "../utils/validation.js";
import {
  showSwal,
  saveToLocalStorage,
  getFromLocalstorage,
  getLocalstorage,
  fetchApi,
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

const toEnglishDigits = (value = "") =>
  value.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)).replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));

let isVerifyingOtp = false;

const handleOtpVerification = async (otpCode) => {
  if (isVerifyingOtp) return;

  const userPhone = getLocalstorage();
  if (!userPhone?.phone) {
    await showSwal("خطا", "شماره تلفن یافت نشد", "error", "تلاش مجدد");
    window.location.href = "login.html";
    return;
  }

  const otp = toEnglishDigits(String(otpCode ?? "").trim());
  if (otp.length !== 5) {
    await showSwal("خطا", "کد تایید باید ۵ رقم باشد", "error", "متوجه شدم");
    return;
  }

  const userInfo = {
    phone: toEnglishDigits(userPhone.phone),
    otp,
  };

  try {
    isVerifyingOtp = true;
    const response = await fetch(`${baseURL}/auth/verify-by-phone`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      await showSwal(
        "خطا",
        data?.message || "کد تایید نامعتبر است یا منقضی شده است",
        "error",
        "تلاش مجدد",
      );
      return data;
    }

    const res = await fetch(`${baseURL}/users/me`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    let redirectUrl = "register.html";
    if (res.ok) {
      const user = await res.json();
      if (user.firstName && user.lastName) {
        redirectUrl = "index.html";
      }
    }

    window.location.href = redirectUrl;
    return data;
  } catch (error) {
    console.error("خطا:", error);
    await showSwal("خطا", "مشکل در ارتباط با سرور", "error", "تلاش مجدد");
  } finally {
    isVerifyingOtp = false;
  }
};

const getInformationsUser = async () => {
  const firstNameInput = document.querySelector("#firstName");
  const lastNameInput = document.querySelector("#lastName");

  const newUserInfos = {
    firstName: firstNameInput.value.trim(),
    lastName: lastNameInput.value.trim(),
    birthDate: "2025-11-02",
    gender: "man",
  };

  const responseRefresh = await fetchApi(`${baseURL}/users/update-profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUserInfos),
  });

  const data = await responseRefresh.json();
  if (responseRefresh.status == 200) {
    window.location.href = "index.html";
  }
  return data;
};

const getMe = async () => {
  const response = await fetchApi(`${baseURL}/users/me`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};



export { register, handleOtpVerification, getInformationsUser, getMe };
