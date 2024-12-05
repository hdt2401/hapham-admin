import axios from "axios";
const API_URL = "http://localhost:3000/v1/api/about/";

const createCertificate = async (data:object) => {
  return await axios.post(API_URL + "certificate/", data);
};
const getCertificateList = async () => {
  return await axios.get(API_URL + "certificate/");
};
const getCertificate = async (id:string) => {
  return await axios.get(API_URL + "certificate/" + id);
};
const updateCertificate = async (id:string, data: object) => {
  return await axios.put(API_URL + "certificate/" + id, data);
};
const deleteCertificate = async (id:string) => {
  return await axios.delete(API_URL + "certificate/" + id);
};
const CertificateService = {
  createCertificate,
  getCertificateList,
  getCertificate,
  updateCertificate,
  deleteCertificate
};
export default CertificateService;