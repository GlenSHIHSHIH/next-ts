import api from "pages/api/baseApi";
// cookie  套件參考 https://dev.to/debosthefirst/how-to-use-cookies-for-persisting-users-in-nextjs-4617
// import { useCookies } from "react-cookie"
// cookie  套件參考 https://www.npmjs.com/package/universal-cookie
import Cookies from 'universal-cookie';


const getConfigByUrlApi = (data: null | any) => {
    return api("get", "/forestage/config", data, null)
}

//實作取出 config 內容
export const getConfigApi = async () => {

    const cookies = new Cookies();
    const cookieBaseConfig = "BASE_CONFIG";
    var config = cookies.get(cookieBaseConfig);

    if (config != null && config != undefined) {
        return config;
    }

    var configData: any = "";

    await getConfigByUrlApi(null)?.then(async res => {
        // console.log("getConfig");
        // console.log(res);
        configData = res.data.baseConfig;
    }).catch(error => {
        console.log("getConfig 錯誤");
    })

    cookies.set(cookieBaseConfig, JSON.stringify(configData), {
        path: "/",
        maxAge: Number(process.env.DEFAULT_BASE_CONFIG_COOKIE_TIME), // Expires after 5 minutes
        sameSite: true,
    });

    return JSON.stringify(configData);

}

