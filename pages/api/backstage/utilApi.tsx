import { Auth } from "@context/reducer";

export const setAuthHeader = (auth: Auth) => {
    return { headers: { Authorization: "Bearer " + auth.authorityJwt?.token } };
}