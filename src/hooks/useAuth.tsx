import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { userAltentication } from "../redux/sliceAltentication";

export interface AuthType {
  token: string;
  auth: boolean;
}

interface AuthHookType {
  auth: boolean;
  token: string;
  saveToken: (arg: AuthType) => void;
}

function useAuth() {
  const dadosAutentication = useSelector(userAltentication);

  console.log(dadosAutentication.data.accessToken);

  const [authObj, setAuth] = useState<any>();

  const getTokenInLocalStorage = () => {
    if (!dadosAutentication.data.accessToken) {
      return { token: "" };
    }

    const  token  = dadosAutentication.data.accessToken

    return { token };
  };

  useEffect(() => {
    setAuth(getTokenInLocalStorage());
  }, [dadosAutentication]);

  return { token: authObj };
}

export default useAuth;
