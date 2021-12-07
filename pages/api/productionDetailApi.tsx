// production/[id].tsx
import api from "pages/api/baseApi";

export const getProductionById = (data: null | any) => {
    // console.log("data:");
    // console.log("/production/"+data.id);
    return api("get", "/production/" + data.id, null, null)
}

export const getProductionRank = (data: null | any) => {
    // console.log("data:");
    // console.log("/production/"+data.id);
    return api("get", "/production/rank/" + data.count, null, null)
}