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
    userInfo?: UserInfo,
    authorityJwt?: AuthorityJwt,
    msg?: string,
    type: string,
    loading?: boolean
}

const cookies = new Cookies();
export const cookieUserInfo = "USER_INFO";

let userInfo = cookies.get(cookieUserInfo)
    ? JSON?.parse(cookies.get(cookieUserInfo) ?? {})?.userInfo
    : null;
let authorityJwt = cookies.get(cookieUserInfo)
    ? JSON?.parse(cookies.get(cookieUserInfo) ?? {})?.authorityJwt
    : null;

export const initialState: Auth = {
    userInfo: null || userInfo,
    authorityJwt: null || authorityJwt,
    msg: "",
    type: "",
    loading: false
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