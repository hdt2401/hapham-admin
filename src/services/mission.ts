import axios from "axios";
const API_URL = "http://localhost:3001/v1/api/mission";

const createMission = async (data:object) => {
  return await axios.post(API_URL, data);
};
const getMissionList = async (data) => {
  return await axios.get(API_URL + `?page=${data.page}&size=${data.pageSize}`);
};
const getMission = async (id:string) => {
  return await axios.get(API_URL + `/${id}`);
};
const updateMission = async (id:string, data: object) => {
  return await axios.put(API_URL + `/${id}`, data);
};
const deleteMission = async (id:string) => {
  return await axios.delete(API_URL  + `/${id}`);
};
const MissionService = {
  createMission,
  getMissionList,
  getMission,
  updateMission,
  deleteMission
};
export default MissionService;