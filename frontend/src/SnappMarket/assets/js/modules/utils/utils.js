const showSwal = (title, text, icon, confirmButtonText) => {
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonText,
    buttonsStyling: false,
    customClass: {
      popup: "swal-custom-popup",
      title: "swal-custom-title",
      htmlContainer: "swal-custom-text",
      confirmButton: "swal-custom-button",
    },
  });
};
const saveToLocalStorage = (key, value) => {
  return localStorage.setItem(key, JSON.stringify(value));
};

const getFromLocalstorage = (key) => {
  return JSON.stringify(localStorage.getItem(key));
};

const getLocalstorage = () => {
  const userInfos = JSON.parse(localStorage.getItem("user"));
  return userInfos;
};

const fetchApi = async (url, option = {}) => {
  const finalOption = {
    ...option,
    credentials: "include",
  };
  let response = await fetch(url, finalOption);
  if (response.status === 401) {
    const responseRefresh = await fetch(
      `http://127.0.0.1:3000/api/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    if (responseRefresh.ok) {
      response = await fetch(url, finalOption);
    } else {
      // location.href = "login.html";
      return null;
    }
  }
  return response;
};

// const isLogin = () => {
//   const userInfos = localStorage.getItem("user");
//   return userInfos ? true : false;
// };

export {
  showSwal,
  saveToLocalStorage,
  getFromLocalstorage,
  getLocalstorage,
  fetchApi,
 
};
