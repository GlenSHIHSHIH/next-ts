import { Auth } from "context/reducer";
import api from "pages/api/baseApi";
// cookie  套件參考 https://dev.to/debosthefirst/how-to-use-cookies-for-persisting-users-in-nextjs-4617
// import { useCookies } from "react-cookie"
// cookie  套件參考 https://www.npmjs.com/package/universal-cookie
import Cookies from 'universal-cookie';
import { setAuthHeader } from "./utilApi";

export const logoutApi = (auth: Auth) => {
    return api("post", "/backstage/admin/logout", null, setAuthHeader(auth))
}

const getNavigationApi = (data: null | any) => {
    return api("get", "/backstage/menu/list", null, data);
}

const cookies = new Cookies();
const cookieNavigation = "NAVIGATION_MENU_LIST";

export const removeNavCookie = () => {
    const cookies = new Cookies();
    cookies.remove(cookieNavigation);
}
//取出 菜單 內容
export const getNaviApi = async (auth: Auth) => {

    var data = cookies.get(cookieNavigation);
    console.log(cookieNavigation);
    console.log(data);

    if (data != null && data != undefined) {
        return data;
    }

    var navigationData: any = "";

    await getNavigationApi(setAuthHeader(auth))?.then(async res => {
        navigationData = res.data.menu;
        if (navigationData != "" && navigationData != null && navigationData != undefined) {

            let jsonData =JSON.stringify(navigationData);
            console.log("configData:");
            console.log(process.env.DEFAULT_BACKSTAGE_COOKIE_PATH);
            console.log(process.env.DEFAULT_BASE_CONFIG_COOKIE_TIME);
            console.log("jsonData:");
            console.log(jsonData);

            cookies.set(cookieNavigation, navigationData, {
                path: process.env.DEFAULT_BACKSTAGE_COOKIE_PATH,
                maxAge: Number(process.env.DEFAULT_BASE_CONFIG_COOKIE_TIME), // Expires after 5 minutes
                sameSite: true,
            });
        }
    }).catch(error => {
        console.log("Navigation 錯誤");
        return;
    })

    // if (navigationData != "" && navigationData != null && navigationData != undefined) {

    //     let jsonData =JSON.stringify(navigationData);
    //     console.log("configData:");
    //     console.log(process.env.DEFAULT_BACKSTAGE_COOKIE_PATH);
    //     console.log(process.env.DEFAULT_BASE_CONFIG_COOKIE_TIME);
    //     console.log("jsonData:");
    //     console.log(jsonData);

    //     cookies.set(cookieNavigation, JSON.stringify(navigationData), {
    //         path: process.env.DEFAULT_BACKSTAGE_COOKIE_PATH,
    //         maxAge: Number(process.env.DEFAULT_BASE_CONFIG_COOKIE_TIME), // Expires after 5 minutes
    //         sameSite: true,
    //     });
    // }

    console.log(cookies.get(cookieNavigation));
    return JSON.stringify(navigationData);

}

