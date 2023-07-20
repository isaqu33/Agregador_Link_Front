//className='w-full bg-black h-[100%] min-h-[950px]'

import { useEffect, useState } from "react";
import {
  Link,
  Navigate,
  Outlet,
  useNavigate,
  useParams,
} from "react-router-dom";
import img from "./assets/pixeltruewebdesign.png";

import {
  Eye,
  HouseSimple,
  Link as IconLink,
  LinkSimpleHorizontalBreak,
  SignOut,
  SquaresFour,
} from "phosphor-react";
import { useDispatch, useSelector } from "react-redux";
import {
  error_Altentication,
  sucess_Altentication,
  userAltentication,
} from "./redux/sliceAltentication";
import LogoApp from "./componentes/logoApp";
import { request_User, sucess_User, userMe } from "./redux/user/sliceUser";
import useApi from "./server/api";

import { useQuery } from "react-query";
import { ChakraProvider } from "@chakra-ui/react";
import Preview from "./pages/Preview";
import screenSize from "../src/hooks/screenSize";
import AppState from "./AppState";
import { observer } from "mobx-react";

const App = observer(() => {
  const { getMe } = useApi();

  const navigate = useNavigate();

  const dadosuser = useSelector(userMe);

  const dispath = useDispatch();

  const tamanhoTela = screenSize();

  // console.log(tamanhoTela);

  const { data, isLoading, refetch } = useQuery("USER", getMe, {
    staleTime: 1000 * 60 * 60,

    onSuccess: (data) => dispath(sucess_User(data.data)),

    onError: (error) =>
      dispath(
        error_Altentication({
          accessToken: "",
          uid: "",
          isLogged: false,
        })
      ),
  });

  const NavLink = [
    {
      Nome: "Links",
      rota: "/costumer",
      icon: <LinkSimpleHorizontalBreak size={22} />,
    },
    {
      Nome: "Aparência",
      rota: "/costumer/appearance",
      icon: <SquaresFour size={22} />,
    },
  ];

  // console.log(AppState.formato)

  const [colorbg, setcolorbg] = useState("Links");
  const [previo, setprevio] = useState(false);

  const url = window.location.href;
  // console.log(url);
  // console.log(url.indexOf("costumer/appearance"));
  // console.log(url.indexOf("/costumer"));

  useEffect(() => {
    if (url.indexOf("costumer/appearance") != -1) {
      // setcolorbg("Appearance");

      navigate("/costumer", { replace: true });
    }
    if (url.indexOf("/costumer") != -1) {
      setcolorbg("Links");
      // console.log("costumer")
    }
  }, []);

  return (
    <ChakraProvider disableGlobalStyle={true}>
      <div className="w-full flex justify-around p-1 ">
        <div className="w-full  text-zinc-100 flex flex-col items-center pt-[20px] select-none  min-h-[100vh] scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-100">
          <div className="w-full flex justify-center items-center flex-col  max-w-[1000px] mb-[10px]">
            <div className="w-full   flex h-[90px] sm:h-[100px] ">
              <div className="w-full  flex justify-between items-center h-[90px]  sm:h-[100px]  ">
                <LogoApp />

                {tamanhoTela <= 918 ? (
                  <Link
                    onClick={() => {
                      if (previo) {
                        setprevio(false);
                      } else setprevio(true);
                    }}
                    to={previo ? "/costumer" : "/costumer/preview"}
                    replace
                    className=" flex  items-center justify-between bg-[#796292] p-1 rounded-lg "
                  >
                    {previo ? (
                      <>
                        <HouseSimple size={22} />{" "}
                      </>
                    ) : (
                      <>
                        <Eye size={22} />
                      </>
                    )}
                  </Link>
                ) : null}
              </div>
            </div>

            <nav className="w-[100%] max-w-[900px]    mt-3 overflow-x-auto scrollbar-none p-4 flex justify-between items-center  ">
              <div className=" flex">
                {NavLink.map((item, index) => (
                  <Link
                    key={index}
                    style={{
                      backgroundColor: `${
                        colorbg == item.Nome ? "#cc9dec" : "rgb(76 29 149)"
                      }`,
                    }}
                    to={item.rota}
                    onClick={() => {
                      setcolorbg(item.Nome);
                    }}
                    className="text-xl mr-5 w-20px  hover:bg-violet-200 p-3 rounded-md flex  justify-between items-center"
                  >
                    {item.Nome}

                    <div>{item.icon}</div>
                  </Link>
                ))}
              </div>

              <span
                onClick={() => {
                  dispath(
                    error_Altentication({
                      accessToken: "",
                      uid: "",
                      isLogged: false,
                    })
                  );
                  dispath(sucess_User(""));
                  <Navigate to="/login" replace />;
                }}
                className=" bg-red-700 p-1 rounded-lg flex justify-center items-center"
              >
                {" "}
                <SignOut size={22} /> sair
              </span>
            </nav>
          </div>
          {/* bg-zinc-200 */}

          <div className="w-full bg-zinc-200  max-w-[900px] rounded-[20px] p-2 min-h-[400px]">
            <Outlet />
          </div>
        </div>

        {tamanhoTela >= 918 ? (
          <div className="w-[600px] h-full min-h-[840px] flex flex-col justify-center items-center ">
            <a
              href={`http://localhost:3001/${data?.data.id}`}
              target="_blank"
              className="w-[25%] rounded-xl mb-5 bg-[#FF8066] h-full flex justify-center items-center "
            >
              Ver Link
            </a>
            <div className="w-[65%] min-h-[530px] bg-slate-700 border-solid border-[14px] rounded-[45px] border-[#000000] overflow-hidden  ">
              <div
                // src="http://localhost:3001/preview"
                className="w-full h-[550px] overflow-y-scroll "
              >
                <Preview dados={data?.data}></Preview>
              </div>
            </div>
          </div>
        ) : null}

        {/* <div className="w-[65%] min-h-[530px] bg-slate-700 border-solid border-[10px] rounded-[30px] border-[#060606] overflow-hidden">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/MqpaHQzP3CM"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3835.359125222547!2d-47.996405284559266!3d-15.994810088926958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9359875618741535%3A0x25d492a2f966e460!2sSanta%20Maria%2C%20Bras%C3%ADlia%20-%20DF%2C%2072593-112!5e0!3m2!1spt-BR!2sbr!4v1665428496866!5m2!1spt-BR!2sbr"
          width="400"
          height="400"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div> */}
      </div>
    </ChakraProvider>
  );
});

export default App;
