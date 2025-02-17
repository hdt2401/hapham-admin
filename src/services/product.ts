import axios from "axios";
const API_URL = "http://localhost:3001/v1/api/product";

const createProduct = async (data) => {
  return await axios.post(API_URL, data);
};
const getProductList = async (data) => {
  return await axios.get(API_URL + `?page=${data.page}&size=${data.pageSize}`);
};
const getProduct = async (id) => {
  return await axios.get(API_URL + `/${id}`);
};
const updateProduct = async (id, data) => {
  return await axios.put(API_URL + `/${id}`, data);
};
const deleteProduct = async (id) => {
  return await axios.delete(API_URL + `/${id}`);
};
const ProductService = {
  createProduct,
  getProductList,
  getProduct,
  updateProduct,
  deleteProduct
};
export default ProductService;