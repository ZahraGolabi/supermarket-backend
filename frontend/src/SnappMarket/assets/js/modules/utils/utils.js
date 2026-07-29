const showSwal = (title, text, icon, confirmButtonText) => {
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonText,
  });
};
const saveToLocalStorage = (key, value) => {
  return localStorage.setItem(key, JSON.stringify(value));
};

const getFromLocalstorage = (key) => {
  return JSON.stringify(localStorage.getItem(key));
};

const getToken = () => {
  const userInfos = JSON.parse(localStorage.getItem("user"));
  return userInfos;
};

<<<<<<< HEAD
export { showSwal, saveToLocalStorage, getFromLocalstorage, getToken };
=======
const fetchApi = async (url, option) => {
  option.credentials = "include";
  let response = await fetch(url, option);
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
      response = await fetch(url, option);
    } else {
      location.href = "login.html";
    }
  }
  return response;
};

export { showSwal, saveToLocalStorage, getFromLocalstorage, getToken ,fetchApi };
>>>>>>> 4313ff028c008694081b3239a65d0579afa3ba92
