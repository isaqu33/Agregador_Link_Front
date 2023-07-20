
import * as Yup from 'yup';



//   dataTime: Yup.date().transform(parseDateString).required()

// const phoneRegExp = /^\((?:[14689][1-9]|2[12478]|3[1234578]|5[1345]|7[134579])\) (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/;


const spotifyUrlRegex = /^https?:\/\/(?:open|play)\.spotify\.com\/(track|album|playlist|artist)\/[a-zA-Z0-9]+\?si=[a-zA-Z0-9_-]+$/;
const whatsappUrlRegex = /^https?:\/\/api\.whatsapp\.com\/(send|wa|p)\/\?phone=[0-9]+$/;
const youtubeUrlRegex = /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/)?([a-zA-Z0-9_-]{11})/;
const twitchUrlRegex = /^(?:https?:\/\/)?(?:www\.)?twitch\.tv\/([a-zA-Z0-9_]{4,25})$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// const regexImgUrl = /(data:image\/png;base64[^"]+)/


// export const PhoneNuberSiginup = Yup.object().shape({
//     phoneNumber: Yup.string().required().matches(phoneRegExp, "Numero inválido")
// })

// export const schemaFormCreateConvite = Yup.object().shape({
//     name: Yup.string().required(),
//     dataTime: Yup.string().required(),
//     local: Yup.array().required().of(
//         Yup.object().shape({
//             name: Yup.string().required(),
//             horario: Yup.string().required(),
//             link: Yup.string().required(),
//         })
//     ),
//     fraseHome: Yup.string().required(),
//     fraseCapa: Yup.string().required(),
//     person1: Yup.string().required(),
//     person2: Yup.string(),
//     photoConviteURL: Yup.string().required("selecione uma imagem para seu convite!!").url(),
// });

export const schemaFormLinkType = Yup.object().shape({
    titulo: Yup.string().required("  Nenhum Título adicionado"),
    Link: Yup.string().required("  Nenhum Link adicionado").url("url invalida"),

});

export const schemaFormSpotifyType = Yup.object().shape({

    Spotify: Yup.string().required().matches(spotifyUrlRegex, "URL spotify errada"),
    // Spotify: Yup.string().required("  Nenhum Título adicionado"),

});
export const schemaFormyoutubeType = Yup.object().shape({

    Youtube: Yup.string().required().matches(youtubeUrlRegex, "URL youtube errada"),
    // Spotify: Yup.string().required("  Nenhum Título adicionado"),

});
export const schemaFormwhatsappType = Yup.object().shape({

    Whatsapp: Yup.string().required("  Nenhum link de whatsaap Título adicionado"),
    // Spotify: Yup.string().required("  Nenhum Título adicionado"),

});
export const schemaFormtwitchType = Yup.object().shape({

    Twitch: Yup.string().required().matches(twitchUrlRegex, "URL twitch errada"),
    // Spotify: Yup.string().required("  Nenhum Título adicionado"),

});
export const schemaFormSemailType = Yup.object().shape({

    Email: Yup.string().required().matches(emailRegex, "URL spotify errada"),
    // Spotify: Yup.string().required("  Nenhum Título adicionado"),

});





