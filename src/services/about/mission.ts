import axios from "axios";
const API_URL = "http://localhost:3000/v1/api/about/";

const createMission = async (data:object) => {
  return await axios.post(API_URL + "mission/", data);
};
const getMissionList = async () => {
  return await axios.get(API_URL + "mission/");
};
const getMission = async (id:string) => {
  return await axios.get(API_URL + "mission/" + id);
};
const updateMission = async (id:string, data: object) => {
  return await axios.put(API_URL + "mission/" + id, data);
};
const deleteMission = async (id:string) => {
  return await axios.delete(API_URL + "mission/" + id);
};

const MissionService = {
  createMission,
  getMissionList,
  getMission,
  updateMission,
  deleteMission
};

export default MissionService;