// production/list.tsx
import api from "pages/api/baseApi";

export const getProductionList = (data: null | any) => {
    return api("get", "/production/list?", data, { params: data })
}

export const getCategoryList = (data: null | any) => {
    return api("get", "/category/list", data, null)
}

export const getCarouselList = (data: null | any) => {
    return api("get", "/carousel/list", data, null)
}