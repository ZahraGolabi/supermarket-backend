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

export { showSwal, saveToLocalStorage, getFromLocalstorage, getToken };
