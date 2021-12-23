import { Auth, setCookieUserInfo } from "@context/reducer";
import api from "pages/api/baseApi";


// export  const test= async (auth: Auth):Promise<boolean> => {
//    return await jwtAuthMiddleware(auth);
// }

// 身份驗證
export const jwtAuthMiddleware = async (auth: Auth): Promise<boolean> => {

    //無 token 踢出
    var jwt: string = auth.authorityJwt?.token ?? "";
    if (jwt == "" || jwt.length < 10) {
        // console.log("nontoken");
        //跳回 login 頁面
        console.log("無 token");
        return false;
    }

    //期限少於半小時 更新 token
    var expireCheck: boolean = jwtExpireCheck(jwt);
    if (!expireCheck) {
        //refresh token 更新
        if (await jwtRefesh(auth)) {
            // 成功  return true;
            console.log("refresh token 更新成功");
            return true;
        };
        // 失敗  return false;
        console.log("refresh token 更新失敗");
        return false;
    }

    //無法刷新 token，跳回login 頁面
    return await jwtValidate(auth);
}

//更新 時間
async function jwtRefesh(auth: Auth): Promise<boolean> {

    var apiData = api("post", "/backstage/jwt/refreshtoken", { refreshToken: auth.authorityJwt?.refreshToken }, null);
    var returnData = await apiData?.then(res => {
        setCookieUserInfo({ ...res.data, type: 'LOGIN_SUCCESS' });
        console.log("更新 jwt成功");
        return true;
    }).catch(error => {
        console.log(error);
        console.log("更新 jwt失敗");
        return false;
    });

    console.log("return :" + returnData);
    return returnData ?? false;
}

//驗證 jwt
async function jwtValidate(auth: Auth): Promise<boolean> {
    var apiData = api("post", "/backstage/jwt/check", null, { headers: { Authorization: "Bearer " + auth.authorityJwt?.token } });
    var returnBool = await apiData?.then(res => {
        if (res.data.id > 0) {
            console.log("驗證 jwt成功");
            return true;
        }
    }).catch(error => {
        console.log(error);
        console.log("驗證 jwt失敗");
        return false;
    });
    // console.log("return :"+returnBool);
    return returnBool ?? false;
}

//驗證時間 期限少於半小時內 return false
function jwtExpireCheck(jwt: string): boolean {
    //get jwt data
    var arrJwt: string[] = jwt.split(".");

    //生存時間驗證
    var jwtData = atob(arrJwt[1]);
    var jwtExpire: number = Number(JSON.parse(jwtData).exp) - Number(process.env.DEFAULT_JWT_CHECKED_TIME);
    var timestampNow: number = Math.floor(Date.now() / 1000);
    // console.log(timestampNow);
    // console.log(timestampNow <= jwtExpire);

    if (timestampNow < jwtExpire) {
        return true;
    }

    return false;
}


