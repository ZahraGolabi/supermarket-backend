import { validations } from "../utils/validation.js";
import {
  showSwal,
  saveToLocalStorage,
  getFromLocalstorage,
  getToken,
<<<<<<< HEAD
} from "../utils/utils.js";
import { baseURL } from "../../config.js";
=======
  fetchAuth,
} from "../utils/utils.js";
import { baseURL } from "../../config.js";

>>>>>>> 4313ff028c008694081b3239a65d0579afa3ba92
const register = async () => {
  const phoneInput = document.querySelector("#phone");
  if (!validations(phoneInput.value)) {
    showSwal("خطا", "شماره موبایل معتبر نیست.", "error", "متوجه شدم");
    return;
  }
  const newUserInfos = {
    phone: phoneInput.value,
  };
<<<<<<< HEAD

=======
  
>>>>>>> 4313ff028c008694081b3239a65d0579afa3ba92
  try {
    const response = await fetch(`${baseURL}/auth/register-by-phone`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUserInfos),
<<<<<<< HEAD
    });
    const data = await response.json();
    if (response.ok) {
      await showSwal("کد تایید", data.otp, "info", "متوجه شدم");
      saveToLocalStorage("user", { phone: phoneInput.value });
      window.location.href = "passwordLogin.html";
=======
      credentials: "include",
    });
    const data = await response.json();
    console.log(response);

    if (response.ok) {
      await showSwal("کد تایید", data.otp, "info", "متوجه شدم");
      saveToLocalStorage("user", { phone: phoneInput.value });
      location.href = "passwordLogin.html";
>>>>>>> 4313ff028c008694081b3239a65d0579afa3ba92
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
<<<<<<< HEAD
=======
    credentials: "include",
>>>>>>> 4313ff028c008694081b3239a65d0579afa3ba92
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
