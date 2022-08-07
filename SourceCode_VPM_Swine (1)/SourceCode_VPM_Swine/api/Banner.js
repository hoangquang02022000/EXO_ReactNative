import { Path } from './Path';
import { GET_DATA } from './Fetch';

export const Api = {
    _getBannerPos: Path.API + 'Banner/getPos?pos=',
}

export const getBannerWithPos = (pos, handleData) => GET_DATA(Api._getBannerPos + pos, res => {
    handleData(res);
})
