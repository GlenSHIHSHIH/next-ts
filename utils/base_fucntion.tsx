import { GetServerSidePropsContext } from "next";

export default function getCurrentUrl(context: GetServerSidePropsContext) {
    var currentUrl = "";
    let req = context.req;
    let protocol = 'https://'
    let host = req.headers.host ? req.headers.host : ""
    if (host == "") {
        protocol = '';
    } else if (host.indexOf('localhost') > -1) {
        protocol = 'http://';
    }
    currentUrl = protocol + host + (req.url ?? "")

    console.log(currentUrl);
    return currentUrl;
}