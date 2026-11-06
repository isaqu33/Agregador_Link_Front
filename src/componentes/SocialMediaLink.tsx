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
const AVATARES = Array.from({ length: 12 }, (_, i) => `/assets/avatars/avatar-${String(i + 1).padStart(2, "0")}.svg`);
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
        width: 80,
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
  const [aspect, setAspect] = useState<number | undefined>(1);

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
      onError: () => setshowLouder(false),
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
      const inicial = centerAspectCrop(width, height, aspect);
      setCrop(inicial);
      // o recorte inicial já vale para salvar, mesmo sem o usuário mexer
      setCompletedCrop({
        unit: "px",
        x: (inicial.x / 100) * width,
        y: (inicial.y / 100) * height,
        width: (inicial.width / 100) * width,
        height: (inicial.height / 100) * height,
      });
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
        <div className="flex flex-col items-center gap-5 mt-2">
          <div className="w-[120px] h-[120px] rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 ring-4 ring-violet-500/30">
            {me?.photoURL ? (
              <img src={me.photoURL} alt="Foto de perfil" className="w-full h-full object-cover" />
            ) : (
              <span aria-hidden className="w-full h-full flex items-center justify-center text-4xl font-semibold text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-500/20 select-none">
                {(me?.title || me?.name || "?").trim().charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <label
            htmlFor="InputImg"
            tabIndex={0}
            className="cursor-pointer h-10 px-5 inline-flex items-center justify-center rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
          >
            <input
              className="hidden"
              type="file"
              accept="image/*"
              id="InputImg"
              onChange={onSelectFile}
            />
            {me?.photoURL ? "Enviar outra foto" : "Enviar uma foto"}
          </label>

          <div className="w-full max-w-[400px] flex flex-col items-center">
            <div className="w-full flex items-center gap-3 mb-4">
              <span className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
              <span className="text-xs text-zinc-500 dark:text-zinc-400">ou escolha um avatar</span>
              <span className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {AVATARES.map((src, i) => {
                const atual = me?.photoURL === src;
                return (
                  <button
                    key={src}
                    type="button"
                    aria-label={`Usar avatar ${i + 1}`}
                    aria-pressed={atual}
                    disabled={atual}
                    onClick={() => {
                      setshowLouder(true);
                      mutateChangePhotoProfile(src);
                    }}
                    className={`w-14 h-14 rounded-full overflow-hidden transition-transform hover:scale-105 outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                      atual ? "ring-4 ring-violet-500" : "ring-1 ring-zinc-200 dark:ring-zinc-700"
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center max-w-[400px]">
          <div className="w-full flex justify-center rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 p-3">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              circularCrop
              keepSelection
              minWidth={60}
              minHeight={60}
            >
              <img
                className="max-w-full max-h-[320px] block"
                ref={imgRef}
                alt="Recortar foto"
                src={imgSrc}
                style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          </div>

          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3">
            Arraste e ajuste o círculo para escolher o enquadramento.
          </p>

          <div className="w-full flex items-center justify-center gap-3 mt-5">
            <button
              className="h-10 px-6 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors outline-none"
              onClick={() => {
                saveonServerImgSaved();
                setshowLouder(true);
              }}
            >
              Salvar
            </button>
            <button
              className="h-10 px-6 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-medium transition-colors outline-none"
              onClick={() => setImgSrc("")}
            >
              Cancelar
            </button>
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
