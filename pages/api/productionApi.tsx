// production/list.tsx
import api from "pages/api/baseApi";

export const getProductionListApi = (data: null | any) => {
    return api("get", "/production/list?", data, { params: data })
}

export const getCategoryListApi = (data: null | any) => {
    return api("get", "/production/category/list", data, null)
}

export const getCarouselListApi = (data: null | any) => {
    return api("get", "/carousel/list", data, null)
}