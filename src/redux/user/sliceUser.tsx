import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { User } from "../../utils/types"

//interface state inicial 


interface UserState {
    data: any,
    error?: string
}

const initialState: UserState = {
    data: {},
}

const sliceUser = createSlice({
    name: 'user',
    initialState,

    //função que vãõ receber um parametro state e action
    reducers: {
        //editaltentication() já é nossa propria action
        request_User: (state):UserState => {
            return state
        },
        sucess_User: (state, { payload }: PayloadAction<any>): UserState => {
            
            return {
                data: {
                    ...payload
                }
               

            }
        },
        error_User: (state, { payload }: PayloadAction<any>):UserState => {
            return {
                data: {
                    ...payload
                }
                
            }
        }

    },
})

//aqui estampos exportando o reducer 
export default sliceUser.reducer

//aqui estamos exportando a action
export const { request_User, sucess_User, error_User } = sliceUser.actions

//o seletor que vai ser consumido pedo useSelector
export const userMe = (state: any):UserState => {
    return state.user;
}