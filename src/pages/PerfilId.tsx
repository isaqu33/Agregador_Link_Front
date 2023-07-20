import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import imgfeliz from "../assets/feliz.png";

import { Image } from "@chakra-ui/react";

import { Fire } from "phosphor-react";
import { userMe } from "../redux/user/sliceUser";
import { link } from "../utils/types";
import ItensLinks from "../componentes/ItensLinks";
import ItensLinkPersonal from "../componentes/ItensLinkPersonal";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useApi from "../server/api";

function PerfilId() {
  let { id } = useParams();

  const { getDataById } = useApi();

  const { data, isLoading, refetch } = useQuery(
    "infouserByid",
    () => getDataById(id as string),

    {
      staleTime: 1000 * 1000,
    }
  );

  console.log(data?.links);

  const [gradienteCor, setGradienteCor] = useState("");
  const [normalCor, setnormalCor] = useState("");

  console.log(gradienteCor);
  console.log(normalCor);

  useEffect(() => {
    if (data?.template) {
      // console.log("entrou na condição de se existir template");
      const parsedTemplate = JSON.parse(data?.template as string).cor;

      // console.log(parsedTemplate);

      if (parsedTemplate.indexOf("linear") != -1) {
        setnormalCor("");
        setGradienteCor(parsedTemplate);
      } else {
        setGradienteCor("");
        setnormalCor(parsedTemplate);
      } // Resto do código aqui
    }
  }, [data?.template]);

  return (
    <div className="w-full min-h-[100vh] bg-[#00000083] flex  justify-center">
      <div
        className="w-full max-w-[500px] bg-slate-600 min-h-[100%]   p-2 flex flex-col items-center rounded-lg"
        style={{
          backgroundColor: `${normalCor ? normalCor : ""}`,
          backgroundImage: `${gradienteCor ? gradienteCor : ""}`,
        }}
      >
        {/* div da imagem */}
        <div className="w-full h-[90px]  flex items-center justify-center">
          <div className="w-[90px]  h-[90px] rounded-[50%] flex items-center justify-center  overflow-hidden bg-black mt-5">
            {(data?.photoURL as any) ? (
              <Image
                // borderRadius="full"
                boxSize="100px"
                objectFit="cover"
                src={data?.photoURL}
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
        {/* <h1 className="text-[20px] mt-10">{params.id}</h1> */}
        <p className="text-[26px] w-full mt-2 flex flex-col items-center justify-center break-normal">
          {data?.title}{" "}
          {/* <Fire size={32} color={"#f7b239"} weight="bold" /> */}
        </p>
        {/* <h1 className="text-[20px] mt-10">{params.id}</h1> */}
        <p className="text-[14px] mt-10 break-normal flex flex-col justify-center items-center">
          {data?.about}{" "}
        </p>

        <div className="w-full  flex flex-col  mt-5 ">
          {data?.links?.map((item, index) =>
            item.isActivit == true ? (
              <ItensLinkPersonal key={index} link={item} />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}

export default PerfilId;
