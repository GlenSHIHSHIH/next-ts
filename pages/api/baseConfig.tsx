import api from "./baseApi";

const getConfig = (data: null | any) => {
    return api("get", "/forestage/config", data, null)
}

//實作取出 config 內容
export const config=()=>{

}

