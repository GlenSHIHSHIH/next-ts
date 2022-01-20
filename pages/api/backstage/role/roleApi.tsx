import { Auth } from "@context/reducer";
import api from "pages/api/baseApi";
import { setAuthHeader } from "../utilApi";

export const roleApi = (data: any, auth: Auth) => {
    // console.log("values");
    // console.log({ ...setAuthHeader(auth), params: data });
    return api("get", "/backstage/role", null, { ...setAuthHeader(auth), params: data })
}

export const roleByIdApi = (data: any, auth: Auth) => {
    // console.log("values");
    // console.log({ ...setAuthHeader(auth), params: data });
    return api("get", "/backstage/role/" + data, null, { ...setAuthHeader(auth) })
}
export const roleEditByIdApi = (data: any, auth: Auth) => {
    // console.log("values");
    // console.log({ ...setAuthHeader(auth), params: data });
    return api("put", "/backstage/role/edit/" + data.id, data, { ...setAuthHeader(auth) })
}
export const roleAddApi = (data: any, auth: Auth) => {
    // console.log("values");
    // console.log({ ...setAuthHeader(auth), params: data });
    return api("post", "/backstage/role/create", data, { ...setAuthHeader(auth) })
}

export const roleDeleteApi = (data: any, auth: Auth) => {
    // console.log("values");
    // console.log({ ...setAuthHeader(auth), params: data });
    return api("delete", "/backstage/role/delete/" + data, null, { ...setAuthHeader(auth) })
}

export const getNavigationAllApi = (data: any, auth: Auth) => {
    return api("get", "/backstage/menu/all", null, { ...setAuthHeader(auth) })
}