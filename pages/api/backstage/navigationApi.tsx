import api from "pages/api/baseApi";
// cookie  套件參考 https://dev.to/debosthefirst/how-to-use-cookies-for-persisting-users-in-nextjs-4617
// import { useCookies } from "react-cookie"
// cookie  套件參考 https://www.npmjs.com/package/universal-cookie
import Cookies from 'universal-cookie';


const getNavigationApi = (data: null | any) => {
    return api("get", "/backstage/menu/list", null, data)
}

//實作取出 config 內容
export const getNaviApi = () => {

    const cookies = new Cookies();
    const cookieName = "NAVIGATION_MENU_LIST";
    var data = cookies.get(cookieName);

    if (data != null && data != undefined) {
        return data;
    }

    var navigationData: any = "";

    getNavigationApi(null)?.then(async res => {
        // console.log("getConfig");
        // console.log(res);
        navigationData = res.data.menu;
    }).catch(error => {
        console.log("Navigation 錯誤");
    })

    cookies.set(cookieName, JSON.stringify(navigationData), {
        path: "/backstage",
        maxAge: Number(process.env.DEFAULT_BASE_CONFIG_COOKIE_TIME), // Expires after 5 minutes
        sameSite: true,
    });

    return JSON.stringify(navigationData);

}

