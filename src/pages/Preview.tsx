import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import imgfeliz from "../assets/feliz.png";

import { Image } from "@chakra-ui/react";

import { Fire } from "phosphor-react";
import { userMe } from "../redux/user/sliceUser";
import { UserCACH, dataToPreviue, link } from "../utils/types";
import ItensLinks from "../componentes/ItensLinks";
import ItensLinkPersonal from "../componentes/ItensLinkPersonal";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useApi from "../server/api";
import { UserAaparence } from "../redux/UserAaparence";
import AppState from "../AppState";
import { observer } from "mobx-react";

interface PreviewProps {
  dados: dataToPreviue;
}

const Preview = observer(({ dados }: PreviewProps) => {
  const dadosuser = useSelector(userMe);
  const dadosuserdsds = useSelector(UserAaparence);

  // console.log(dados?.template);

  const queryClient = useQueryClient();

  const data = queryClient.getQueryData("USER");
  // console.log(data?.data);
  const template = data?.data?.template;
  // console.log(template);

  const [gradienteCor, setGradienteCor] = useState("");
  const [normalCor, setnormalCor] = useState("");

  // console.log(gradienteCor, normalCor);
  const url = window.location.href;

  useEffect(() => {
    if (url.indexOf("/costumer") != -1) {
      if (dados?.template) {
        // console.log("entrou na condição de se existir template");
        const parsedTemplate = JSON.parse(dados?.template as string).cor;

        // console.log(parsedTemplate);

        if (parsedTemplate.indexOf("linear") != -1) {
          setnormalCor("");
          setGradienteCor(parsedTemplate);
        } else {
          setGradienteCor("");
          setnormalCor(parsedTemplate);
        } // Resto do código aqui
      }
    }
  }, [url]);

  useEffect(() => {
    if (dados?.template) {
      // console.log("entrou na condição de se existir template");
      const parsedTemplate = JSON.parse(dados?.template as string).cor;

      // console.log(parsedTemplate);

      if (parsedTemplate.indexOf("linear") != -1) {
        setnormalCor("");
        setGradienteCor(parsedTemplate);
      } else {
        setGradienteCor("");
        setnormalCor(parsedTemplate);
      } // Resto do código aqui
    }
  }, [dados?.template]);

  // console.log(JSON.parse(dados?.template as string).formato)

  useEffect(() => {
    if (AppState.corFundo != "") {
      console.log("dfsfsdfsdfsdfsdf");
      if (AppState.corFundo.indexOf("linear") != -1) {
        setnormalCor("");
        setGradienteCor(AppState.corFundo);
      } else {
        setGradienteCor("");
        setnormalCor(AppState.corFundo);
        // console.log("entrou no else de cor normal ");
      }
    }
  }, [AppState.corFundo]);

  return (
    <div className="w-full min-h-[100%] bg-[#4c1d95] flex  justify-center rounded-lg ">
      <div
        className="w-full max-w-[500px] bg-slate-600 min-h-[100%]   p-2 flex flex-col items-center rounded-lg  "
        style={{
          backgroundColor: `${normalCor ? normalCor : ""}`,
          backgroundImage: `${gradienteCor ? gradienteCor : ""}`,
        }}
      >
        {/* div da imagem */}
        <div className="w-full h-[90px]  flex items-center justify-center">
          <div className="w-[90px]  h-[90px] rounded-[50%] flex items-center justify-center  overflow-hidden bg-black mt-5">
            {dadosuser.data.photoURL ? (
              <Image
                // borderRadius="full"
                boxSize="100px"
                objectFit="cover"
                src={dadosuser.data.photoURL}
                alt="Dan Abramov"
              />
            ) : (
              // <img
              //   src={dadosuser.data.photoURL}
              //   alt="imagem"
              //   // className="min-w-full h-full rounded-[12px] bg-black"
              //   className="min-w-full min-h[100%]"
              // />
              <img
                src={imgfeliz}
                alt="imagem"
                className="w-full min-h[100%] rounded-[50px]"
              />
            )}
          </div>
        </div>

        <p className="text-[26px] w-full mt-2 flex flex-col items-center justify-center break-normal">
          {AppState.descricao ? AppState.descricao : data?.data.title}{" "}
          {/* <Fire size={32} color={"#f7b239"} weight="bold" /> */}
        </p>
        {/* <h1 className="text-[20px] mt-10">{params.id}</h1> */}
        <p className="text-[14px] mt-10 break-normal flex flex-col justify-center items-center">
          {AppState.counter}
          {AppState.counter ? AppState.counter : data?.data?.about}{" "}
        </p>

        <div className="w-full  flex flex-col  mt-5   ">
          {data?.data.links.map((item: any, index: any) =>
            item.isActivit == true ? (
              <ItensLinkPersonal
                key={index}
                link={item}
                formato={AppState.formato}
                formatoBase={dados?.template? JSON.parse(dados?.template as string).formato :"" }
              />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
});

export default Preview;
