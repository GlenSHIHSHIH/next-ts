import { Auth } from "@context/reducer";
import { getNavigationApi } from "@pages/api/baseFunctionApi";
import { MenuNestData } from "component/backstage/Navigation";
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


export const substring = (value: string | undefined, count: number) => {
    let str = "";
    if (value != undefined && value.length <= count) {
        str = value;
    } else {
        str = value?.substring(0, count - 1) + "...";
    }
    return str;
}


export function interfacePropertyToMap<T, K extends keyof T>(obj: T) {

    var map = new Map();
    (Object.keys(obj) as Array<keyof T>).forEach(
        (value) => {
            map.set(value.toString(), obj[value]);
        }
    );
    return map;
}

//編輯屬性
export function setValueToInterfaceProperty<T, K extends keyof T>(obj: T, key: K, value: any) {
    obj[key] = value;
    return obj
}

export function objArrtoMap(objData: any) {
    return objData?.map((p: any) => {
        return [p.name.toString(), p.id.toString()]
    })
}

//判斷功能有無權限
export async function featureRole(auth: Auth, url: string): Promise<boolean> {

    let menuList: MenuNestData[];

    menuList = await getNavigationApi(auth)?.then((resp: any) => {
        return resp.data.menu;
    }).catch(error => {
        return false;
    });

    return findLoopBy(url, menuList);
}

function findLoopBy(url: string, data: MenuNestData[]): boolean {
    for (let index = 0; index < data.length; index++) {
        if (url == data[index].url) {
            return true;
        }
        if (data[index].child != null) {
            let check = findLoopBy(url, data[index].child);
            if (check) {
                return true;
            }
        }
    }
    return false;
}