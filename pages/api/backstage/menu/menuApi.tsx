import { Auth } from "@context/reducer";
import api from "pages/api/baseApi";
import { setAuthHeader } from "../utilApi";

export const menuApi = (data: any, auth: Auth) => {
    console.log("values");
    console.log({ ...setAuthHeader(auth), params: data });
    return api("get", "/backstage/menu", null, { ...setAuthHeader(auth), params: data })
}

export const menuParentListApi = (data: any, auth: Auth) => {
    console.log("values");
    console.log({ ...setAuthHeader(auth), params: data });
    return api("get", "/backstage/menu/parent/list", null, { ...setAuthHeader(auth), params: data })
}
