// Import the functions you need from the SDKs you need
import { async } from "@firebase/util";
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { collection, getDocs } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signOut } from "firebase/auth";

import { getDownloadURL, getStorage, ref, uploadBytesResumable, uploadString } from "firebase/storage"

const firebaseApp = initializeApp(
    {
        apiKey: "AIzaSyC48CDqZlisyq5ntMuHB8BJE3yij2slBEI",
        authDomain: "generetelink.firebaseapp.com",
        projectId: "generetelink",
        storageBucket: "generetelink.appspot.com",
        messagingSenderId: "359031411130",
        appId: "1:359031411130:web:cb456c0c6112717f6b0d83"
    }
);



const db = getFirestore();

export const storage = getStorage(firebaseApp)



// aqui setamos o fire base para receber os um popup para autenticação do firebase: -------------------

const providerGoogle = new GoogleAuthProvider();
const auth = getAuth()
auth.languageCode = 'it'



export async function logarGoogle() {
    let resultado = await signInWithPopup(auth, providerGoogle)
    let { uid } = resultado.user
    return { uid }

}

// aqui setamos o fire base para receber os um popup para autenticação do facebook no firebase: -------------------

const providerFacebook = new FacebookAuthProvider();

export async function logarFacebook() {
    let resultado = await signInWithPopup(auth, providerFacebook)
    let { uid } = resultado.user
    return { uid }

}

// ---------------------------------------------------------------------------------------------------------


// aqui setamos uma função para fazer logout: ---------------------------------------------------------------------------
export async function logout() {
    let resultado = await signOut(auth)
    return resultado
}




// --------------------------------------------------------------------------------------------------------

const metadata = {
    contentType: "image/png",
};

interface handleUploadProp {
    uid: string, 
    baseUrl: string
}

export async function handleUpload({baseUrl, uid }:handleUploadProp) {
    //criando uma "pasta" no storage com nome: imagens, para guardas as mesmas lá

    const storageRef = ref(
        storage,
        `provedor/imagens/${uid}`
    );

    //aqui vamos salvar de fato no farebase
    // const uploadTask = uploadString(storageRef, baseUrl as string);

    console.log(baseUrl)

    const texte = uploadString(storageRef, baseUrl as string, "base64").then((snapshot: any) => {
        console.log(snapshot);
    }).catch((err: any) => {
        console.log(err)
    })

    




}


// uploadTask.on(
//     "state_changed",
//     //projeção do tempo que está sendo feito o upload para o firebase
//     (snapshot) => {
//         const progress =
//             (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//     },
//     (error) => {
//         alert(error);
//     },
//     () => {
//         getDownloadURL(uploadTask.snapshot.ref).then((url) => {
//             setUrl(url);
//         });
//     }
// );
// };

// const deletImg = () => {
//     //Create a reference to the file to delete
//     const desertRef = ref(
//         storage,
//         `provedor/imagens/${dadosUser.data.uid}/${file.name}`
//     );

//     deleteObject(desertRef)
//         .then((sucess) => {
//             alert(sucess);
//         })
//         .catch((error) => {
//             alert(error);
//         });

//     setFile("");
//     setUrl("");
// };