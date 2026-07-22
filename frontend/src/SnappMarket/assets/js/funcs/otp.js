
const isValidation = (key) => {
  return /^[0-9۰-۹]$/.test(key);
};

const setupOtpAutoFocus = () => {
  const inputs = document.querySelectorAll(".otp-input");

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
};

setupOtpAutoFocus();
