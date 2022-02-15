import { Auth } from "@context/reducer";
import api from "pages/api/baseApi";
import { setAuthHeader } from "../utilApi";


export const cacheKeyListApi = (data: any, auth: Auth) => {
    return api("get", "/backstage/cache", null, { ...setAuthHeader(auth) })
}

export const cacheDeleteApi = (data: any, auth: Auth) => {
    return api("delete", "/backstage/cache/delete/" + data, null, { ...setAuthHeader(auth) })
}

export const cacheAnyDeleteApi = (data: any, auth: Auth) => {
    return api("delete", "/backstage/cache/any/delete/" + data, null, { ...setAuthHeader(auth) })
}
