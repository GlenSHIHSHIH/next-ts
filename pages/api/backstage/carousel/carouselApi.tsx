import { Auth } from "@context/reducer";
import api from "pages/api/baseApi";
import { setAuthHeader } from "../utilApi";

export const carouselApi = (data: any, auth: Auth) => {
    return api("get", "/backstage/carousel", null, { ...setAuthHeader(auth), params: data })
}

export const carouselByIdApi = (data: any, auth: Auth) => {
    return api("get", "/backstage/carousel/" + data, null, { ...setAuthHeader(auth) })
}
export const carouselEditByIdApi = (data: any, auth: Auth) => {
    return api("put", "/backstage/carousel/edit/" + data.id, data, { ...setAuthHeader(auth) })
}
export const carouselAddApi = (data: any, auth: Auth) => {
    return api("post", "/backstage/carousel/create", data, { ...setAuthHeader(auth) })
}

export const carouselDeleteApi = (data: any, auth: Auth) => {
    return api("delete", "/backstage/carousel/delete/" + data, null, { ...setAuthHeader(auth) })
}
