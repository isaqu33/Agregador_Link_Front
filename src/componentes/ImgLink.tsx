import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { userAltentication } from "../redux/sliceAltentication";
import { storage } from "../server/firebase";
import imgfeliz from "../assets/feliz.png";

import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

function ImgLink() {
  const dadosUser = useSelector(userAltentication);

  const [file, setFile] = useState<any>();

  const [fileDataURL, setFileDataURL] = useState<any>();

  const [url, setUrl] = useState<string>();

  const [crop, setCrop] = useState<Crop>({
    unit: "px", // Pode ser 'px' ou '%'
    x: 20,
    y: 20,
    width: 50,
    height: 50,
  });

  // -----------------------------------------------
  useEffect(() => {
    if (file) {
      let fileReader = new FileReader();

      fileReader.onload = (e: any) => {
        const { result } = e.target;

        if (result) {
          setFileDataURL(result);
        }
      };

      fileReader.readAsDataURL(file);
    }

    // return () => {};
  }, [file]);

  const handleUpload = () => {
    //criando uma "pasta" no storage com nome: imagens, para guardas as mesmas lá

    const storageRef = ref(
      storage,
      `provedor/imagens/${dadosUser.data.uid}/${file.name}`
    );

    //aqui vamos salvar de fato no farebase
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      //projeção do tempo que está sendo feito o upload para o firebase
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setUrl(url);
        });
      }
    );
  };

  const deletImg = () => {
    //Create a reference to the file to delete
    const desertRef = ref(
      storage,
      `provedor/imagens/${dadosUser.data.uid}/${file.name}`
    );

    deleteObject(desertRef)
      .then((sucess) => {
        alert(sucess);
      })
      .catch((error) => {
        alert(error);
      });

    setFile("");
    setUrl("");
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full flex items-center justify-center mb-4">
        <h2 className="md:text-[22px] text-[18px] mb-3 text-[#3f3f46]">
          Escolha uma foto para seu avatar
        </h2>
      </div>
      <div className="w-[70px] mb-3 h-[70px] rounded-[50px] ">
        {url ? (
          <img
            src={url}
            alt="imagem"
            className="w-full min-h[100%] rounded-[50px]"
          />
        ) : (
          <img
            src={imgfeliz}
            alt="imagem"
            className="w-full min-h[100%] rounded-[50px]"
          />
        )}
      </div>

      <div className="w-full flex flex-col  items-center justify-center">
        <div className="bg-violet-800 cursor-pointer w-[130px] h-8 flex items-center justify-center rounded-[10px] hover:bg-violet-600">
          {url ? (
            <span
              className="cursor-pointer bg-[#C8341D] hover:bg-[#8A0000] h-full w-full flex items-center justify-center rounded-[10px]"
              onClick={deletImg}
            >
              Apagar Imagem
            </span>
          ) : (
            <form>
              <label htmlFor="InputImg" tabIndex={0}>
                <input
                  className="hidden"
                  type="file"
                  accept="image/*"
                  id="InputImg"
                  onChange={(event: any) => {
                    setFile(event.target.files[0]);
                    console.log(event.target.files[0]);
                  }}
                />
                <span className="cursor-pointer   text-sm hover:bg-violet-600">
                  Carregar Avatar
                </span>
              </label>
            </form>
          )}
        </div>
        {file ? <h1 className="text-slate-900">{file.name}</h1> : null}

        {file ? (
          <ReactCrop
            className="w-[400px] h-[400px] bg-slate-500"
            crop={crop}
            onChange={(c: any) => setCrop(c)}
          >
            <img className="w-[100%]" src={fileDataURL} />
          </ReactCrop>
        ) : null}
      </div>

      {/* {fileDataURL ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 absolute">
          <div className="w-[250px] h-[200px] bg-red-500 rounded-[20px]  overflow-hidden">
            <img className="w-[100%]" src={fileDataURL} alt="preview" />
          </div>
          <h1 className="text-slate-500 text-[10px]">{file.name}</h1>

          <p className="text-[18px] text-slate-900">
            Deseja realmente escolher essa imagem para seu perfil?
          </p>

          <div className="w-full max-w-[400px]  flex items-center justify-around p-5">
            <button
              className="w-[120px] mt-2 hover:bg-violet-400 bg-[#A971F1] rounded-[10px] p-4 h-[40px] flex items-center justify-center outline-none"
              onClick={handleUpload}
            >
              Salvar
            </button>
            <button
              className="w-[120px] mt-2 hover:bg-violet-400 bg-[#A971F1] rounded-[10px] p-4 h-[40px] flex items-center justify-center outline-none"
              onClick={() => {
                setFile(null);
                setFileDataURL(null);
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : null} */}
    </div>
  );
}

export default ImgLink;
