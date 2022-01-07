import { removeNavCookie } from '@pages/api/backstage/navigationApi';
import { Auth, initialState, removeCookieUserInfo, setCookieUserInfo } from 'context/reducer';


export default function SetUserInfo(dispatch: any, data: Auth) {
    console.log(data);
    try {
        dispatch({ type: 'REQUEST_LOGIN' });
        if (data.userInfo != null && data.authorityJwt != null) {
            dispatch({ ...data, type: 'LOGIN_SUCCESS' });
            setCookieUserInfo({...data,type: 'LOGIN_SUCCESS'});
            // return data;
            return null;
        }

        dispatch({ ...initialState() , type: 'LOGIN_ERROR' });
        return null;
    } catch (error) {
        dispatch({ ...initialState(),type: 'LOGIN_ERROR', msg: String(error) });
    }
}

export function logoutRemoveCookie(dispatch: any) {
    removeCookieUserInfo();
    removeNavCookie();
    dispatch({ type: 'LOGOUT' });
}