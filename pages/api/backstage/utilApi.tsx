import { Auth } from "@context/reducer";

export interface PageMutlSearchData {
    count: number,
    page: number,
    pageLimit: number,
    sort: string,
    sortColumn: string,
    search?: Map<string, string>,
}


export const setAuthHeader = (auth: Auth) => {
    return { headers: { Authorization: "Bearer " + auth.authorityJwt?.token } };
}