import {
  InstagramLogo,
  LinkBreak,
  LinkSimpleHorizontal,
  Image,
  MapPinLine,
  CaretDown,
} from "phosphor-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import SimpleLink from "./SimpleLink";

import BtnAddLink from "../componentes/btnAddLink";

import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import { canvasPreview } from "../canvasPreview";
import { useDebounceEffect } from "../useDebounceEffect";

import "react-image-crop/dist/ReactCrop.css";

const imgfeliz = "/assets/feliz.png";
import useApi from "../server/api";
import useMe, { ME_KEY } from "../hooks/useMe";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TailSpin } from "react-loader-spinner";

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 50,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

function SocialMediaLink() {
  const { data: me } = useMe();
  

  const { editProfile, uploadImage } = useApi();

  // -----------------------------------------------------------------
  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<any>();
  // const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [completedCrop, setCompletedCrop] = useState<any>();

  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(16 / 9);

  const [file, setFile] = useState<any>();

  const [imgselecionada, setimgselecionada] = useState<any>("");

  const [showLouder, setshowLouder] = useState<boolean>(false);

  const client = useQueryClient();

  const { mutate: mutateChangePhotoProfile } = useMutation(
    (photoURL: string) => editProfile({ photoURL }),
    {
      onSuccess: () => {
        client.invalidateQueries(ME_KEY);
        setImgSrc("");

      
        setshowLouder(false)
      },
    }
  );

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  async function saveonServerImgSaved() {

    const texte1 = await canvasPreview(
      imgRef.current,
      previewCanvasRef.current,
      completedCrop,
      scale,
      rotate,
      true
    );

    setimgselecionada(texte1);
  }

  useEffect(() => {
    if (!imgselecionada) return;

    // the cropped image arrives as a data URL; send it to the API (Azure Blob)
    fetch(imgselecionada as string)
      .then((res) => res.blob())
      .then((blob) => uploadImage(blob))
      .then((url) => mutateChangePhotoProfile(url))
      .catch((err) => {
        setshowLouder(false);
      });
  }, [imgselecionada]);

 

  return showLouder ? (
    <div className=' w-full h-full flex justify-center items-center'>
      <TailSpin
        height="200"
        width="80"
        color="#4c1d95"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  ) : (
    <div className="w-full h-full flex flex-col items-center ">
      <div className="w-full flex items-center justify-center ">
        <h2 className="md:text-[15px] text-[18px] mb-3 text-[#3f3f46] dark:text-zinc-300">
          Escolha uma foto para seu perfil!
        </h2>
      </div>

      {!imgSrc ? (
        <div className="w-[120px] mb-3 h-[120px] rounded-[20px] flex items-center justify-center  overflow-hidden">
          {me?.photoURL ? (
            <img
              src={me?.photoURL}
              alt="imagem"
              className="min-w-full h-[70%] rounded-[12px]"
            />
          ) : (
            <img
              src={imgfeliz}
              alt="imagem"
              className="w-full min-h[100%] rounded-[50px]"
            />
          )}
        </div>
      ) : null}

      <div>
        {!imgSrc ? (
          <div className="bg-violet-800 cursor-pointer w-[130px] h-8 flex items-center justify-center rounded-[10px] hover:bg-violet-600">
            <form>
              <label htmlFor="InputImg" tabIndex={0}>
                <input
                  className="hidden"
                  type="file"
                  accept="image/*"
                  id="InputImg"
                  onChange={onSelectFile}
                />
                <span className="cursor-pointer flex justify-center items-center   text-sm hover:bg-violet-600">
                  {`${me?.photoURL ? "Editar" : "Carregar"} Avatar`}
                </span>
              </label>
            </form>
          </div>
        ) : null}
      </div>
      {!!imgSrc && (
        <div className="w-full flex flex-col items-center justify-center flex-1 rounded-[20px] max-w-[400px] ">
          <div className="w-[250px] ">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              className="w-[100%] h-[250px]"
            >
              <img
                className="w-[100%] min-h-full"
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          </div>

          <div className="w-full  flex items-center justify-center flex-col ">
            <span className=" text-[5px] text-[black] ">{file.name}</span>

            <div className="w-full rounded-[20px]  flex items-center justify-around ">
              <button
                className="w-[120px]  hover:bg-violet-400 bg-[#4c1d95] rounded-[10px] p-4 h-[40px] flex items-center justify-center outline-none"
                onClick={() => {
                  saveonServerImgSaved();
                  setshowLouder(true)
                }}
              >
                Salvar
              </button>
              <button className="w-[120px]  hover:bg-violet-400 bg-[#4c1d95] rounded-[10px] p-4 h-[40px] flex items-center justify-center outline-none"
              onClick={()=>{setImgSrc("")}}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      <div style={{ display: "none" }}>
        {!!completedCrop && (
          <canvas
            ref={previewCanvasRef}
            style={{
              border: "1px solid black",
              objectFit: "contain",
              width: completedCrop.width,
              height: completedCrop.height,
            }}
          />
        )}
      </div>
    </div>
  );
}

export default SocialMediaLink;
