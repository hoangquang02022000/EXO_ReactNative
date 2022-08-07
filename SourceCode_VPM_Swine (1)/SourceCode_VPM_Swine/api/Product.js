import { Path } from './Path';
import { GET_DATA } from './Fetch';

export const Api = {
    _saleProduct: Path.API + 'Product/getSaleProduct',
    _bestSaleProduct: Path.API + 'Product/getBestSaleProduct',
    _newestProduct: Path.API + 'Product/getNewestProduct',
    _recommendProduct: Path.API + 'Product/getRecommendProduct',
    _list: Path.API + 'Product/getAll?page=',
    _detail: Path.API + 'Product/Detail?id=',
    _productByGroup: Path.API + 'Product/ByGroup?g=',
    _productByBusiness: Path.API + 'Product/ByBusiness?g=',
    //group
    _listProductGroup: Path.API + 'ProductGroup/getAll',
    //business
    _listBusiness: Path.API + "Business/getAll",
    _search: Path.API + 'Product/Search?keyword='
}
export const getProductByBusiness = (g, page,  handleData) => GET_DATA(Api._productByBusiness + g + '&page=' + page, res => {
    handleData(res);
})

export const getProductByGroup = (g, page, size = 52,  handleData) => GET_DATA(Api._productByGroup + g + '&page=' + page + '&s=' + size, res => {
    handleData(res);
})

export const getDetailProduct = (id, handleData) => GET_DATA(Api._detail + id, res => {
    handleData(res);
})

export const getSaleProduct = (handleData) => GET_DATA(Api._saleProduct, res => {
    handleData(res);
})

export const getBestSaleProduct = (handleData) => GET_DATA(Api._bestSaleProduct, res => {
    handleData(res);
})

export const getNewestProduct = (handleData) => GET_DATA(Api._newestProduct, res => {
    handleData(res);
})

export const getRecommendProduct = (handleData) => GET_DATA(Api._recommendProduct, res => {
    handleData(res);
})

export const getAllProduct = (page, handleData) => GET_DATA(Api._list + page, res => {
    handleData(res);
})

//product group
export const getAllProductGroup = (handleData) => GET_DATA(Api._listProductGroup, res => {
    handleData(res);
})

//product business
export const getAllBusiness = (handleData) => GET_DATA(Api._listBusiness, res => {
    handleData(res);
})

export const searchProduct = (keyword, handleData) => GET_DATA(Api._search + keyword, res => {
    handleData(res);
})

