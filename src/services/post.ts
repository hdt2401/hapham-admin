import axios from "axios";
const API_URL = "http://localhost:3001/v1/api/post";

const createPost = async (data:object) => {
  return await axios.post(API_URL, data);
};
const getPostList = async (data) => {
  return await axios.get(API_URL + `?page=${data.page}&size=${data.pageSize}`);
};
const getPost = async (id:string) => {
  return await axios.get(API_URL + `/${id}`);
};
const updatePost = async (id:string, data: object) => {
  return await axios.put(API_URL + `/${id}`, data);
};
const deletePost = async (id:string) => {
  return await axios.delete(API_URL  + `/${id}`);
};
const PostService = {
  createPost,
  getPostList,
  getPost,
  updatePost,
  deletePost
};
export default PostService;