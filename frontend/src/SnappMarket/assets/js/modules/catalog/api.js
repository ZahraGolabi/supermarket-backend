import { baseURL } from "../../config.js";

const DEFAULT_CATEGORY_IMAGE = "assets/img/8.webp";
const DEFAULT_PRODUCT_IMAGE = "assets/img/25.webp";

const parseListResponse = async (response, label) => {
  if (!response?.ok) {
    throw new Error(`خطا در دریافت ${label}`);
  }
  const payload = await response.json();
  return payload.data ?? [];
};

export const getCategories = async (page = 1, limit = 50) => {
  const response = await fetch(
    `${baseURL}/category/?page=${page}&limit=${limit}`,
  );
  return parseListResponse(response, "دسته‌بندی‌ها");
};

export const getCategory = async (id) => {
  const response = await fetch(`${baseURL}/category/${id}/`);
  if (!response.ok) {
    throw new Error("دسته‌بندی پیدا نشد");
  }
  return response.json();
};

export const getBrandsByCategory = async (categoryId, page = 1, limit = 50) => {
  const response = await fetch(
    `${baseURL}/brand/?categoryId=${categoryId}&page=${page}&limit=${limit}`,
  );
  return parseListResponse(response, "برندها");
};

export const getProducts = async ({
  categoryId = "",
  brandId = "",
  page = 1,
  limit = 40,
} = {}) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    isAvailable: "true",
  });

  if (categoryId) {
    params.set("categoryId", categoryId);
  }
  if (brandId) {
    params.set("brandId", brandId);
  }

  const response = await fetch(`${baseURL}/good/?${params.toString()}`);
  return parseListResponse(response, "محصولات");
};

export const formatPrice = (price) =>
  `${Number(price).toLocaleString("fa-IR")} تومان`;

export const getFinalPrice = (product) => {
  if (product.discountPercent > 0) {
    return Math.round(product.price * (1 - product.discountPercent / 100));
  }
  return product.price;
};

export const resolveImage = (url, fallback) => url || fallback;

export const categoryImage = (category) =>
  resolveImage(category?.image, DEFAULT_CATEGORY_IMAGE);

export const productImage = (product) =>
  resolveImage(product?.image, DEFAULT_PRODUCT_IMAGE);

export { DEFAULT_CATEGORY_IMAGE, DEFAULT_PRODUCT_IMAGE };
