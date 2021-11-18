// production/[id].tsx
import api from "./baseApi";

export const getProductionById = (data: null | any) => {
    // console.log("data:");
    // console.log("/production/"+data.id);
    return api("get", "/production/"+data.id, null, null)
}