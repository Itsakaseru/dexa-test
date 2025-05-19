import axios from "axios";

interface LoginData {
  email?: string,
  password?: string,
}

export async function login(data : LoginData) {
  try {
    const res = await axios.post("http://localhost:3000/auth/login", data, {
      withCredentials: true,
    })
  }
  catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      console.log("Failed login");
    }
  }
  return true;
}