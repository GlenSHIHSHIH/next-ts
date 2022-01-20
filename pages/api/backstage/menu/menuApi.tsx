import { Auth } from "@context/reducer";
import api from "pages/api/baseApi";
import { setAuthHeader } from "../utilApi";

export const menuApi = (data: any, auth: Auth) => {
    // console.log("values");
    // console.log({ ...setAuthHeader(auth), params: data });
    return api("get", "/backstage/menu", null, { ...setAuthHeader(auth), params: data })
}

export const menuByIdApi = (data: any, auth: Auth) => {
    // console.log("values");
    // console.log({ ...setAuthHeader(auth), params: data });
    return api("get", "/backstage/menu/" + data, null, { ...setAuthHeader(auth) })
}
export const menuEditByIdApi = (data: any, auth: Auth) => {
    // console.log("values");
    // console.log({ ...setAuthHeader(auth), params: data });
    return api("put", "/backstage/menu/edit/" + data.id, data, { ...setAuthHeader(auth) })
}
export const menuAddApi = (data: any, auth: Auth) => {
    // console.log("values");
    // console.log({ ...setAuthHeader(auth), params: data });
    return api("post", "/backstage/menu/create", data, { ...setAuthHeader(auth) })
}

export const menuParentListApi = (data: any, auth: Auth) => {
    // console.log("values");
    // console.log({ ...setAuthHeader(auth), params: data });
    return api("get", "/backstage/menu/parent/list", null, { ...setAuthHeader(auth), params: data })
}

export const menuDeleteApi = (data: any, auth: Auth) => {
    // console.log("values");
    // console.log({ ...setAuthHeader(auth), params: data });
    return api("delete", "/backstage/menu/delete/" + data, null, { ...setAuthHeader(auth) })
}
