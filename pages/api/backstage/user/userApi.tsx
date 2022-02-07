import { Auth } from "@context/reducer";
import api from "pages/api/baseApi";
import { setAuthHeader } from "../utilApi";

export const userApi = (data: any, auth: Auth) => {
    // console.log("values");
    // console.log({ ...setAuthHeader(auth), params: data });
    return api("get", "/backstage/user", null, { ...setAuthHeader(auth), params: data })
}

export const userByIdApi = (data: any, auth: Auth) => {
    // console.log("values");
    // console.log({ ...setAuthHeader(auth), params: data });
    return api("get", "/backstage/user/" + data, null, { ...setAuthHeader(auth) })
}

export const userEditPwdByIdApi = (data: any, auth: Auth) => {
    // console.log("values");
    // console.log({ ...setAuthHeader(auth), params: data });
    return api("put", "/backstage/user/password/edit/" + data.id, data, { ...setAuthHeader(auth) })
}

export const userResetPwdByIdApi = (data: any, auth: Auth) => {
    // console.log("values");
    // console.log({ ...setAuthHeader(auth), params: data });
    return api("put", "/backstage/user/password/reset/" + data.id, data, { ...setAuthHeader(auth) })
}

export const userEditByIdApi = (data: any, auth: Auth) => {
    // console.log("values");
    // console.log({ ...setAuthHeader(auth), params: data });
    return api("put", "/backstage/user/edit/" + data.id, data, { ...setAuthHeader(auth) })
}

export const userAddApi = (data: any, auth: Auth) => {
    // console.log("values");
    // console.log({ ...setAuthHeader(auth), params: data });
    return api("post", "/backstage/user/create", data, { ...setAuthHeader(auth) })
}

export const userDeleteApi = (data: any, auth: Auth) => {
    // console.log("values");
    // console.log({ ...setAuthHeader(auth), params: data });
    return api("delete", "/backstage/user/delete/" + data, null, { ...setAuthHeader(auth) })
}

export const roleAllListApi = ( auth: Auth) => {
    // console.log("values");
    // console.log({ ...setAuthHeader(auth), params: data });
    return api("get", "/backstage/role/all" , null, { ...setAuthHeader(auth) })
}