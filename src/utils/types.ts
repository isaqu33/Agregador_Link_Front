
export interface AuthType {

    token: string
    auth: boolean

}

export interface erros {
    [index: string]: any
}





export interface link {

    id?: string;
    name?: string;
    link?: string;
    type?: string;
    userId?: string;
    isActivit?: boolean;
    order?: number



}

export interface typeNewArrayIcom {
    type?: string;
    Icon: (props: any) => JSX.Element;
}

export interface CreateLink {


    name: string;
    link?: string;
    type: string;

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
    }

}

export interface dataToPreviue{
    id?: string;
    name?: string;
    email?: string;
    links?: link[];
    photoURL?: string;
    template?: string;
    about?:string;
    title?: string;
    username?: string;
    socials?: Social[];
    emailVerified?: boolean;
}

export interface CreateConviteType {
    dataTime: Date;
    name: string;
    type: "NIVER" | "CASAMENTO"

}



export interface ModelType {
    name: string;
    id: number;
    photoUrl: string;
    role: "FREE" | "PRO" | "PREMIUM"
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
    id: number
};


export interface AnalyticsSummary {
    days: number;
    views: number;
    clicks: number;
    ctr: number;
    daily: { day: string; views: number; clicks: number }[];
    links: { id: string; name: string; clicks: number }[];
}
