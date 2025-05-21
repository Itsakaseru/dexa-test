import type { LoginData } from "@repo/shared-types";
import axios from "axios";

export async function getSelfUserInfo() {
  return await axios.get("http://localhost:3000/user/me", {
    withCredentials: true,
  });
}