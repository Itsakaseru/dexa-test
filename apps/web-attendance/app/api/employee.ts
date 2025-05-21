import axios from "axios";
import { API_URL } from "./config";

export async function getEmployeeDataByUserId(userId: string) {
  return await axios.get(`${ API_URL }/employee/${userId}`, {
    withCredentials: true,
  });
}