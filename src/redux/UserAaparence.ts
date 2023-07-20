//conjunto de logicas de (actions e reducers) que vamos utilizar para gerenciar nosso redux

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//interface state inicial
interface AltenticationPayload {
    template?: string
    title?: string
    about?: string
}

// interface AtenticationState : AltenticationPayload




const initialState: AltenticationPayload = {

    template: "",
    title: "",
    about: ""


};

const sliceUserAaparence = createSlice({
    name: "UserAaparence",
    initialState,

    //função que vãõ receber um parametro state e action
    reducers: {
        //editaltentication() já é nossa propria action
        request_Altentication: (state): AltenticationPayload => {
            return state;
        },
        sucess_Altentication: (
            state,
            { payload }: PayloadAction<AltenticationPayload>
        ): AltenticationPayload => {
            return {

                ...payload,

                // isLogged: true,
            };
        },
        error_Altentication: (
            state,
            { payload }: PayloadAction<AltenticationPayload>
        ): AltenticationPayload => {
            return {

                ...payload,

                // isLogged: false,
            };
        },
    },
});

//aqui estampos exportando o reducer
export default sliceUserAaparence.reducer;

//aqui estamos exportando a action
export const {
    request_Altentication,
    sucess_Altentication,
    error_Altentication,
} = sliceUserAaparence.actions;

//o seletor que vai ser consumido pedo useSelector
export const UserAaparence = (state: any): AltenticationPayload => {
    return state.UserAaparence;
};
