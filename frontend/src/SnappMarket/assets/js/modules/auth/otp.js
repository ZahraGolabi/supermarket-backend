import { handleOtpVerification } from "./auth.js";
import { getLocalstorage } from "../utils/utils.js";

const toEnglishDigits = (value = "") =>
  value.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)).replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));

const collectOtp = (inputs) =>
  toEnglishDigits(
    Array.from(inputs)
      .map((input) => input.value)
      .join(""),
  );

window.addEventListener("load", () => {
  setupOtpAutoFocus();
});

const isValidation = (key) => {
  return /^[0-9۰-۹]$/.test(key);
};

const setupOtpAutoFocus = () => {
  const inputs = document.querySelectorAll(".otp-input");
  const loginNumber = document.querySelector(".login-password__phone-number");
  const user = getLocalstorage();

  if (!user?.phone) {
    window.location.href = "login.html";
    return;
  }

  if (loginNumber) {
    loginNumber.textContent = user.phone;
  }

  inputs.forEach((input, index) => {
    input.addEventListener("keyup", (event) => {
      const { target } = event;
      const digit = toEnglishDigits(target.value);

      if (!isValidation(digit)) {
        target.value = "";
        return;
      }

      target.value = digit;

      if (digit.length === 1 && index + 1 < inputs.length) {
        inputs[index + 1].focus();
      } else if (digit.length > 1) {
        target.value = digit.slice(0, 1);
        inputs[index + 1]?.focus();
      }

      const otp = collectOtp(inputs);
      if (otp.length === inputs.length) {
        handleOtpVerification(otp);
      }
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Backspace") {
        event.preventDefault();
        if (input.value == "") {
          if (index > 0) {
            inputs[index - 1].focus();
            inputs[index - 1].value = "";
          }
        } else {
          input.value = "";
        }
      }
    });
  });
  handleOtpSubmit(inputs);
  toggleSubmitButton(inputs);
};

const handleOtpSubmit = (inputs) => {
  const submitOtp = document.querySelector("#submit-btn__otp");
  if (!submitOtp) return;

  const submit = async () => {
    const otp = collectOtp(inputs);
    if (otp.length !== 5) {
      return;
    }
    submitOtp.disabled = true;
    try {
      await handleOtpVerification(otp);
    } finally {
      submitOtp.disabled = false;
    }
  };

  submitOtp.addEventListener("click", (event) => {
    event.preventDefault();
    submit();
  });

  const form = submitOtp.closest("form");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    submit();
  });
};

const toggleSubmitButton = (inputs) => {
  const submitOtp = document.querySelector("#submit-btn__otp");
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      let allFilled = true;
      inputs.forEach((inputItem) => {
        inputItem.value == "" ? (allFilled = false) : "";
      });
      allFilled
        ? submitOtp.classList.add("valid")
        : submitOtp.classList.remove("valid");
    });
  });
};

export { handleOtpSubmit };
