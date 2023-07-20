// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { call, put, takeEvery, takeLatest } from "redux-saga/effects"
// import { getMe, loginInOurApi } from "../../server/api";
// import { logarGoogle } from "../../server/firebase";
// import { sucess_Altentication, error_Altentication, userAltentication } from "../sliceAltentication";
// import { sucess_User, error_User } from "./sliceUser";





// function* requestUser(): any {




//     try {

        

//         // console.log('dentro da requestUser' + textes())

//         // const firebaseToken = yield call(logarGoogle)
//         const dataUser = yield call(getMe)
//         //chamada para a nossa api pegando passando o firebaseToken, 


//         // console.log(firebaseToken)

//         yield put(sucess_User({

//             dataUser

//         }))

//     } catch (error) {
//         yield put(error_User({
//             error: error
//         }))
//     }
// }

// function* sagaUser() {
//     yield takeLatest('user/request_User', requestUser)
// }

// export default sagaUser;