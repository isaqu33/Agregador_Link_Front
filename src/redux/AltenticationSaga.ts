import { call, put, takeEvery, takeLatest } from "redux-saga/effects"
import  {loginInOurApi}  from "../server/api";
import { logarGoogle } from "../server/firebase"
import { sucess_Altentication, error_Altentication } from "./sliceAltentication";



function* AltenticationGoogle(): any {
    try {

        const firebaseToken = yield call(logarGoogle)
        //chamada para a nossa api pegando passando o firebaseToken, 
        const jwtToken = yield call(loginInOurApi, firebaseToken.uid)



        yield put(sucess_Altentication({
            accessToken: jwtToken,
            uid: firebaseToken,
            isLogged:true
        }))



    } catch (error) {
        yield put(error_Altentication({
            mensage: error,
            isLogged:false
        }))
    }
}

function* sagaAltenticationGoogle() {
    yield takeLatest('altentication/request_Altentication', AltenticationGoogle)
}

export default sagaAltenticationGoogle;

