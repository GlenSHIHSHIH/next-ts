// user.js
import api from "./baseApi";

// export const userSignUp = (signUpData: null | any) => {
//     return api("post", "/user/sign-in", signUpData, null)
// }

// export const userLogIn = (logInData: null | any) => {
//     return api("post", "/user/log-in", logInData, null)
// }

export const getProductionList = (data: null | any) => {
    return api("get", "/production/list", data, null)
}

export const getCategoriesList = (data: null | any) => {
    return api("get", "/categories/list", data, null)
}

// export const userDelete = (userNo: null | any) => {
//     return api("delete", "/user/delete", userNo, null)
// }