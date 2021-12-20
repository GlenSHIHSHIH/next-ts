import { Auth } from "@context/reducer";
import { GetServerSidePropsContext } from "next";
import api from "pages/api/baseApi";

export default async function jwtAuthMiddleware(auth: Auth, context: GetServerSidePropsContext) {

    //無 token 踢出
    var jwt: string = auth.authorityJwt?.token ?? "";
    if (jwt == "" || jwt.length < 10) {
        //跳回 login 頁面
    }

    //期限少於半小時 更新 token
    var arrJwt: string[] = jwt.split(".");

    Authorization: "Bearer " + auth.authorityJwt?.token;
    return api("post", "/backstage/jwt/check", null, { headers: {} })





}
