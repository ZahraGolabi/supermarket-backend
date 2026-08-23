import { handleOtpVerification } from "./auth.js";
import { getLocalstorage } from "../utils/utils.js";

window.addEventListener("load", () => {
  setupOtpAutoFocus();
});

const isValidation = (key) => {
  return /^[0-9۰-۹]$/.test(key);
};

const setupOtpAutoFocus = () => {
  const inputs = document.querySelectorAll(".otp-input");
  const loginNumber = document.querySelector(".login-password__phone-number");
  loginNumber.innerHTML = getLocalstorage().phone;
  inputs.forEach((input, index) => {
    input.addEventListener("keyup", (event) => {
      const { target } = event;
      if (!isValidation(target.value)) {
        target.value = "";
        return;
      }
      if (target.value.length == 1 && index + 1 < inputs.length) {
        inputs[index + 1].focus();
      } else if (target.value.length > 1) {
        target.value = target.value.slice(0, 1);
        inputs[index + 1]?.focus();
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
  submitOtp.addEventListener("click", (event) => {
    event.preventDefault();
    let otp = "";
    inputs.forEach((input) => {
      otp += input.value;
    });

    handleOtpVerification(otp);
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
