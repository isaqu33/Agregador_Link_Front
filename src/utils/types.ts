export interface AuthType {
  token: string;
  auth: boolean;
}

export interface erros {
  [index: string]: any;
}

// extras de um link (null limpa o campo ao editar)
export interface LinkOptions {
  thumbnail?: string | null;
  featured?: boolean;
  startAt?: string | null;
  endAt?: string | null;
  embed?: boolean;
  password?: string;
  removePassword?: boolean;
}

export interface Lead {
  id: string;
  email: string;
  name?: string | null;
  form: string;
  createdAt: string;
}

export interface link {
  id?: string;
  name?: string;
  link?: string;
  type?: string;
  userId?: string;
  isActivit?: boolean;
  order?: number;
  thumbnail?: string | null;
  featured?: boolean;
  startAt?: string | null;
  endAt?: string | null;
  embed?: boolean;
  embedUrl?: string | null;
  locked?: boolean;
}

export interface typeNewArrayIcom {
  type?: string;
  Icon: (props: any) => JSX.Element;
}

export interface CreateLink extends LinkOptions {
  name: string;
  link?: string;
  type: string;
}

export interface Pixels {
  meta?: string;
  ga?: string;
}

export interface PageInfo {
  id: string;
  name: string;
  username?: string;
}

export interface Social {
  network: string;
  url: string;
}

export interface User {
  id?: string;
  name?: string;
  email?: string;
  links?: link[];
  photoURL?: string;
  template?: string;
  title?: string;
  about?: string;
  username?: string;
  socials?: Social[];
  emailVerified?: boolean;
  pixels?: Pixels;
  pages?: PageInfo[];
}

export interface UserCACH {
  data: {
    id?: string;
    name?: string;
    email?: string;
    links?: link[];
    photoURL?: string;
    template?: string;
    title?: string;
  };
}

export interface dataToPreviue {
  id?: string;
  name?: string;
  email?: string;
  links?: link[];
  photoURL?: string;
  template?: string;
  about?: string;
  title?: string;
  username?: string;
  socials?: Social[];
  emailVerified?: boolean;
  pixels?: Pixels;
  pages?: PageInfo[];
}

export interface CreateConviteType {
  dataTime: Date;
  name: string;
  type: "NIVER" | "CASAMENTO";
}

export interface ModelType {
  name: string;
  id: number;
  photoUrl: string;
  role: "FREE" | "PRO" | "PREMIUM";
}

export type TemesType = {
  primary: string;
  name: string;
  color1: string;
  color2: string;
  color3: string;
  color4: string;
  color5: string;
  color6: string;
  color7: string;
  color8: string;
  color9: string;
  id: number;
};

export interface AnalyticsSummary {
  devices: { device: string; views: number }[];
  referrers: { host: string; views: number }[];
  days: number;
  views: number;
  clicks: number;
  ctr: number;
  daily: { day: string; views: number; clicks: number }[];
  links: { id: string; name: string; clicks: number }[];
}
