import axios from "axios";
const API_URL = "http://localhost:3000/v1/api/about/";

const createLeader = async (data:object) => {
  return await axios.post(API_URL + "leader/", data);
};
const getLeaderList = async () => {
  return await axios.get(API_URL + "leader/");
};
const getLeader = async (id:string) => {
  return await axios.get(API_URL + "leader/" + id);
};
const updateLeader = async (id:string, data: object) => {
  return await axios.put(API_URL + "leader/" + id, data);
};
const deleteLeader = async (id:string) => {
  return await axios.delete(API_URL + "leader/" + id);
};

const LeaderService = {
  createLeader,
  getLeaderList,
  getLeader,
  updateLeader,
  deleteLeader
};

export default LeaderService;