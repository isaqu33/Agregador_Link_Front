import axios from "axios";
import { useSelector } from "react-redux";
import { userAltentication } from "../redux/sliceAltentication";
import { CreateLink, User, link } from "../utils/types";
import { string } from "yup";

// console.log(dadosAutentication.data.uid?.uid);

function useApi() {
  const dadosAutentication = useSelector(userAltentication);

  const api = axios.create({ baseURL: "http://localhost:3000" });

  // const dadosAutentication = useSelector(userAltentication);

  const getInvite = async (idconvit: string) => {
    const { data } = await api.get(`/convite/${idconvit}`);
    return data;
  };

  const getUrlImgfromBase = async (baseUrl: string) => {
    const sucesso = await api.get("/createbaseUrl");

    return sucesso;
  };

  const loginInOurApi = async (Uid?: any) => {
    try {
      const sucesso = await api.post("/auth/login", { uid: Uid });

      console.log(sucesso.data.accessToken);

      return sucesso.data.accessToken;
    } catch (error) {
      throw "error";
    }
  };

  const editProfile = async (data: User) => {
    console.log(data);
    try {
      const sucesso = await api.post("/user/editProfile", data, {
        headers: {
          Authorization: `Bearer ${dadosAutentication.data.accessToken}`,
        },
      });

      console.log(sucesso);

      return sucesso;
    } catch (error) {
      throw "error";
    }
  };

  const getMe = async () => {
    try {
      const sucesso = await api.get("/user/me", {
        headers: {
          Authorization: `Bearer ${dadosAutentication.data.accessToken}`,
        },
      });

      // console.log(sucesso.data);

      return sucesso;
    } catch (error) {
      throw "error";
    }
  };

  const CreateNewLink = async (data: CreateLink) => {
    console.log(dadosAutentication.data.accessToken);

    try {
      const sucesso = await api.post("/links/addLink", data, {
        headers: {
          Authorization: `Bearer ${dadosAutentication.data.accessToken}`,
        },
      });

      console.log(sucesso.data);

      return sucesso;
    } catch (error) {
      throw "error";
    }
  };

  const DeleteLink = async (idlink: string) => {
    console.log(idlink);
    let Idlink = idlink;

    try {
      const sucesso = await api.post(
        "/links/deletLink",
        { idlink },
        {
          headers: {
            Authorization: `Bearer ${dadosAutentication.data.accessToken}`,
          },
        }
      );

      console.log(sucesso.data);

      return sucesso;
    } catch (error) {
      throw "error";
    }
  };

  const getDataById = async (idUser: string) => {
    console.log(idUser);

    try {
      const sucesso = await api.get(`/links/getDataUser/${idUser}`);

      console.log(sucesso.data);
      const sucessotipado: User = sucesso.data;

      return sucessotipado;
    } catch (error) {
      throw "error";
    }
  };

  interface editActiveLink {
    id: string;
    activation: boolean;
  }

  const editAtivacao = async (id: string, activation: boolean) => {
    const data = {
      id,
      activation,
    };
   

    try {
      const sucesso = await api.post(`/links/editActivet`, data);

      console.log(sucesso)
      return sucesso.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    getInvite,
    getUrlImgfromBase,
    loginInOurApi,
    editProfile,
    getMe,
    CreateNewLink,
    DeleteLink,
    getDataById,
    editAtivacao,
  };
}

export default useApi;
