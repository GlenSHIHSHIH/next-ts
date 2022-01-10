import { Auth } from "context/reducer";
import api from "pages/api/baseApi";
import { setAuthHeader } from "./utilApi";

//取出 菜單 內容
export const getNaviApi = async (auth: Auth) => {

    var navigationData: string = "";

    await getNavigationApi(setAuthHeader(auth))?.then(async res => {
        navigationData = res.data.menu;

    }).catch(error => {
        console.log("Navigation 錯誤");
        return;
    });

    return JSON.stringify(navigationData);

}

const getNavigationApi = (data: null | any) => {
    return api("get", "/backstage/menu/list", null, data);
}

export const logoutApi = (auth: Auth) => {
    return api("post", "/backstage/admin/logout", null, setAuthHeader(auth))
}


