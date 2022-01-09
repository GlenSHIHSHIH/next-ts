import { Auth } from "context/reducer";
import api from "pages/api/baseApi";
import { useCookie } from "next-cookie";
// cookie  套件參考 https://dev.to/debosthefirst/how-to-use-cookies-for-persisting-users-in-nextjs-4617
// cookie  套件參考 https://www.npmjs.com/package/universal-cookie
import Cookies from 'universal-cookie';
import { setAuthHeader } from "./utilApi";

export const logoutApi = (auth: Auth) => {
    return api("post", "/backstage/admin/logout", null, setAuthHeader(auth))
}

const getNavigationApi = (data: null | any) => {
    return api("get", "/backstage/menu/list", null, data);
}

const cookieNavigation = "NAVIGATION_MENU_LIST";

export const removeNavCookie = () => {
    var cookies = useCookie();
    cookies.remove(cookieNavigation);
}

//取出 菜單 內容
export const getNaviApi = async (auth: Auth) => {

    const cookie = new Cookies();
    var cookies = useCookie();
    var data = cookies.get(cookieNavigation);

    if (data != null && data != undefined) {
        return JSON.stringify(data);
    }

    var navigationData: string = "";

    await getNavigationApi(setAuthHeader(auth))?.then(async res => {
        navigationData = res.data.menu;

    }).catch(error => {
        console.log("Navigation 錯誤");
        return;
    })

    if (navigationData != "") {

        let jsonData = JSON.stringify(navigationData);
        cookies.set(cookieNavigation, jsonData, {
            path: process.env.DEFAULT_BACKSTAGE_COOKIE_PATH,
            maxAge: Number(process.env.DEFAULT_BASE_CONFIG_COOKIE_TIME), // Expires after 5 minutes
            sameSite: true,
        });
    }

    console.log(cookies.get(cookieNavigation));

    return JSON.stringify(navigationData);

}

