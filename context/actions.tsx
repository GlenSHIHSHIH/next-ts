import Cookies from 'universal-cookie';
import { Auth, cookieUserInfo } from 'context/reducer';
import { useAuthStateContext } from './context';


const cookies = new Cookies();
export default function SetUserInfo(dispatch: any, data: Auth) {
    console.log(data);
    try {
        dispatch({ type: 'REQUEST_LOGIN' });
        if (data.userInfo != null && data.authorityJwt != null) {
            dispatch({ ...data, type: 'LOGIN_SUCCESS' });
            cookies.set(cookieUserInfo, JSON.stringify(data), {
                path: "/",
                maxAge: 300,//Number(process.env.DEFAULT_BASE_CONFIG_COOKIE_TIME), // Expires after 5 minutes
                sameSite: true,
            });
            // return data;
            return null;
        }

        dispatch({ ...data, type: 'LOGIN_ERROR' });
        return null;
    } catch (error) {
        dispatch({ type: 'LOGIN_ERROR', msg: String(error) });
    }
}

export async function logout() {
    const { state, dispatch } = useAuthStateContext();
    dispatch({ type: 'LOGOUT' });
    cookies.remove(cookieUserInfo);
}