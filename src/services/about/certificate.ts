import axios from "axios";
const API_URL = "http://localhost:3001/v1/api/about/certificate";

const createCertificate = async (data:object) => {
  return await axios.post(API_URL, data);
};
const getCertificateList = async (data) => {
  return await axios.get(API_URL + `?page=${data.page}&size=${data.pageSize}`);
};
const getCertificate = async (id:string) => {
  return await axios.get(API_URL + `/${id}`);
};
const updateCertificate = async (id:string, data: object) => {
  return await axios.put(API_URL + `/${id}`, data);
};
const deleteCertificate = async (id:string) => {
  return await axios.delete(API_URL  + `/${id}`);
};
const CertificateService = {
  createCertificate,
  getCertificateList,
  getCertificate,
  updateCertificate,
  deleteCertificate
};
export default CertificateService;