import Cookies from 'universal-cookie';

interface UserInfo {
    "id": number,
    "name": string
}
interface AuthorityJwt {
    "token": string,
    "refreshToken": string
}

export interface Auth {
    userInfo?: UserInfo | null,
    authorityJwt?: AuthorityJwt | null,
    msg?: string,
    type?: string,
    loading?: boolean
}

const cookies = new Cookies();
export const cookieUserInfo = "USER_INFO";

//儲存 cookie 登入資訊
export const setCookieUserInfo = (data: Auth) => {
    cookies.set(cookieUserInfo, JSON.stringify(data), {
        path: process.env.DEFAULT_USER_INFO_COOKIE_PATH,
        maxAge: Number(process.env.DEFAULT_BASE_CONFIG_COOKIE_TIME), // Expires after 5 minutes
        sameSite: true,
    });
}

//刪除 cookie 登入資訊
export const removeCookieUserInfo = () => {
    cookies.remove(cookieUserInfo);
}



export const initialState = () => {
    let userAuth: Auth = {};

    if (cookies.get(cookieUserInfo)) {
        userAuth = JSON.parse(JSON.stringify(cookies.get(cookieUserInfo)));
        // console.log(JSON.stringify(userAuth));
        // userAuth = JSON.parse(cookies.get(cookieUserInfo));
    } else {
        userAuth.userInfo = null;
        userAuth.authorityJwt = null;
        userAuth.msg = "";
        userAuth.type = "";
        userAuth.loading = false;
    }
    return userAuth;
};

export const AuthReducer = (state: any, action: Auth) => {
    switch (action.type) {
        case "REQUEST_LOGIN":
            return {
                ...state,
                loading: true
            };
        case "LOGIN_SUCCESS":
            return {
                ...state,
                userInfo: action.userInfo,
                authorityJwt: action.authorityJwt,
                loading: false
            };
        case "LOGOUT":
            return {
                ...state,
                userInfo: null,
                authorityJwt: null
            };

        case "LOGIN_ERROR":
            return {
                ...state,
                loading: false,
                msg: action.msg
            };

        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
};