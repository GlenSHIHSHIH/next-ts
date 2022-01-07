import { GetServerSidePropsContext } from "next";
import api from "pages/api/baseApi";
// cookie  套件參考 https://dev.to/debosthefirst/how-to-use-cookies-for-persisting-users-in-nextjs-4617
// import { useCookies } from "react-cookie"
// cookie  套件參考 https://www.npmjs.com/package/universal-cookie
import Cookies from 'universal-cookie';

const cookieBaseConfig = "BASE_CONFIG";

const getConfigByUrlApi = (data: null | any) => {
    return api("get", "/forestage/config", data, null)
}

//實作取出 config 內容
export const getConfigApi = async (context: GetServerSidePropsContext) => {

    const cookies = new Cookies(context.req.headers.cookie);
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

    if (configData != "") {
        cookies.set(cookieBaseConfig, JSON.stringify(configData), {
            path: process.env.DEFAULT_FORESTAGE_COOKIE_PATH,
            maxAge: Number(process.env.DEFAULT_BASE_CONFIG_COOKIE_TIME), // Expires after 5 minutes
            sameSite: true,
            domain:"http://localhost:3000"
        });
        console.log(cookies.get(cookieBaseConfig));
    }

    return JSON.stringify(configData);

}

