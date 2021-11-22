import { GetServerSidePropsContext } from "next";

export function getCurrentUrl(context: GetServerSidePropsContext) {
    var currentUrl = getDomain(context) + (context.req.url ?? "");
    return currentUrl;
}

export function getDomain(context: GetServerSidePropsContext) {
    var currentDomain = "";
    let req = context.req;
    let protocol = 'https://'
    let host = req.headers.host ? req.headers.host : ""
    if (host == "") {
        protocol = '';
    } else if (host.indexOf('localhost') > -1) {
        protocol = 'http://';
    }
    currentDomain = protocol + host;

    return currentDomain;
}