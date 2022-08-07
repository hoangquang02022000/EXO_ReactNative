import { Path } from './Path';
import { GET_DATA } from './Fetch';

export const Api = {
    _list: Path.API + 'Help/getAll?page=',
}

export const getAllHelp = (page, handleData) => GET_DATA(Api._list + page, res => {
    handleData(res);
})