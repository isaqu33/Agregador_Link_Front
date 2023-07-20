
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
    isActivit?: boolean



}

export interface typeNewArrayIcom {
    type?: string;
    Icon: (props: any) => JSX.Element;
}

export interface CreateLink {


    name: string;
    link: string;
    type: string;

}

export interface User {

    id?: string;
    name?: string;
    email?: string;
    links?: link[];
    photoURL?: string;
    template?: string;
    title?: string;
    about?: string
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
