import { Auth } from "@context/reducer";
import { setAuthHeader } from "./backstage/utilApi";
import api from "./baseApi";

export const getNavigationApi = (auth:Auth) => {
    return api("get", "/backstage/menu/list", null, setAuthHeader(auth));
}