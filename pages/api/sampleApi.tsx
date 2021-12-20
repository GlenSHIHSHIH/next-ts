// user.js
import api from "pages/api/baseApi";

export const userSignUp = (signUpData: null | any) => {
    return api("post", "/user/sign-in", signUpData, null)
}

export const userLogIn = (logInData: null | any) => {
    return api("post", "/user/log-in", logInData, null)
}

export const userLogOut = () => {
    return api("get", "/user/log-out", null, null)
}

export const userDelete = (userNo: null | any) => {
    return api("delete", "/user/delete", userNo, null)
}