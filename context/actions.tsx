import Cookies from 'universal-cookie';
import { Auth, cookieUserInfo } from 'context/reducer';
import { dispatch } from 'context/context';

const cookies = new Cookies();

export function setUserInfo(data: Auth) {
    try {
        dispatch({ type: 'REQUEST_LOGIN' });
        if (data.userInfo != null && data.authorityJwt != null) {
            dispatch({ ...data, type: 'LOGIN_SUCCESS' });
            cookies.set(cookieUserInfo, JSON.stringify(data), {
                path: "/",
                maxAge: Number(process.env.DEFAULT_BASE_CONFIG_COOKIE_TIME), // Expires after 5 minutes
                sameSite: true,
            });
            return data
        }

        dispatch({ ...data, type: 'LOGIN_ERROR' });
        return;
    } catch (error) {
        dispatch({ type: 'LOGIN_ERROR', msg: String(error) });
    }
}

export async function logout() {
    dispatch({ type: 'LOGOUT' });
    cookies.remove(cookieUserInfo);
}