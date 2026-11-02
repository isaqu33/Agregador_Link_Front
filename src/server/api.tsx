import axios from "axios";
import { CreateLink, User } from "../utils/types";

// The browser never holds the API token: requests go through the Next.js proxy
// (app/api/backend), which adds it from the Auth.js session cookie.
const api = axios.create({ baseURL: "/api/backend" });

function useApi() {
  const editProfile = async (data: User) => {
    try {
      return await api.post("/user/editProfile", data);
    } catch (error) {
      throw "error";
    }
  };

  const getMe = async () => {
    try {
      return await api.get("/user/me");
    } catch (error) {
      throw "error";
    }
  };

  const CreateNewLink = async (data: CreateLink) => {
    try {
      return await api.post("/links/addLink", data);
    } catch (error) {
      throw "error";
    }
  };

  const DeleteLink = async (idlink: string) => {
    try {
      return await api.post("/links/deletLink", { idlink });
    } catch (error) {
      throw "error";
    }
  };

  const getDataById = async (idUser: string) => {
    try {
      const { data } = await api.get<User>(`/links/getDataUser/${idUser}`);
      return data;
    } catch (error) {
      throw "error";
    }
  };

  const editAtivacao = async (id: string, activation: boolean) => {
    const { data } = await api.post("/links/editActivet", { id, activation });
    return data;
  };

  const registerUser = async (data: { name: string; email: string; password: string }) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  };

  // Returns the stored path (/media/<user>/<file>) that goes into photoURL.
  const uploadImage = async (file: Blob): Promise<string> => {
    const form = new FormData();
    form.append("file", file, "image.png");
    const { data } = await api.post<{ url: string }>("/media", form);
    return data.url;
  };

  return {
    editProfile,
    getMe,
    CreateNewLink,
    DeleteLink,
    getDataById,
    editAtivacao,
    registerUser,
    uploadImage,
  };
}

export default useApi;
