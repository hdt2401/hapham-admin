import axios from "axios";
const API_URL = "http://localhost:3001/v1/api/about/";

const createVision = async (data:object) => {
  return await axios.post(API_URL + "vision/", data);
};
const getVisionList = async () => {
  return await axios.get(API_URL + "vision/");
};
const getVision = async (id:string) => {
  return await axios.get(API_URL + "vision/" + id);
};
const updateVision = async (id:string, data: object) => {
  return await axios.put(API_URL + "vision/" + id, data);
};
const deleteVision = async (id:string) => {
  return await axios.delete(API_URL + "vision/" + id);
};

const VisionService = {
  createVision,
  getVisionList,
  getVision,
  updateVision,
  deleteVision
};

export default VisionService;