import {
  InstagramLogo,
  LinkBreak,
  LinkSimpleHorizontal,
  Image,
  MapPinLine,
  CaretDown,
  Plus,
  SpotifyLogo,
  YoutubeLogo,
  WhatsappLogo,
  TwitchLogo,
  Envelope,
} from "phosphor-react";

export const typesSocialMediaa = [
  {
    name: "Link",
    Icon: (props: any) => <LinkBreak {...props} />,

    unavailable: false,
    id: 0,
  },
  {
    name: "Spotify",
    Icon: (props: any) => <SpotifyLogo {...props} />,

    unavailable: false,
    id: 1,
  },
  {
    name: "Youtube",
    Icon: (props: any) => <YoutubeLogo {...props} />,

    unavailable: false,
    id: 2,
  },
  {
    name: "Whatsapp",
    Icon: (props: any) => <WhatsappLogo {...props} />,

    unavailable: false,
    id: 3,
  },
  {
    name: "Twitch",
    Icon: (props: any) => <TwitchLogo {...props} />,

    unavailable: false,
    id: 4,
  },
  {
    name: "Email",
    Icon: (props: any) => <Envelope {...props} />,

    unavailable: false,
    id: 5,
  },
];

export const objmodalCreateLink = [
  {
    type: "Link",
    titulo: "Adicionar um Link",
    texto:
      "Cole uma URL do Link escolhiido e mostre na sua lista ;)",
    formatolink: "https://www.Link.com/watch?",
  },
  {
    type: "Spotify",
    titulo: "Adicionar vídeo do Spotify",
    texto:
      "Cole uma URL do Spotify e mostraremos como um vídeo reproduzível na sua lista ;)",
    formatolink: "https://www.Spotify.com/watch?",
  },
  {
    type: "Youtube",
    titulo: "Adicionar vídeo do Youtube",
    texto:
      "Cole uma URL do Youtube e mostraremos como um Local reproduzível na sua lista ;)",
    formatolink: "https://www.Youtube.com/watch?",
  },
  {
    type: "Whatsapp",
    titulo: "Adicionar vídeo do Whatsapp",
    texto:
      "Cole uma URL do Whatsapp e mostraremos como um Local reproduzível na sua lista ;)",
    formatolink: "https://www.Whatsapp.com/watch?",
  },
  {
    type: "Twitch",
    titulo: "Adicionar vídeo do Twitch",
    texto:
      "Cole uma URL do Twitch e mostraremos como um Local reproduzível na sua lista ;)",
    formatolink: "https://www.Twitch.com/watch?",
  },
  {
    type: "Email",
    titulo: "Adicionar vídeo do Email",
    texto:
      "Cole uma URL do Email e mostraremos como um Local reproduzível na sua lista ;)",
    formatolink: "https://www.Email.com/watch?",
  },
];
