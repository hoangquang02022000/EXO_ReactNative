import { Path } from './Path';
import { GET_DATA, POST_DATA } from './Fetch';

export const Api = {
    _getStatus: Path.API + 'GetListWOInfo?',
    _getOrder: Path.API + 'GetListWO?',
    _feeback: Path.API + 'PostFeedback',
    _list_fb: Path.API + 'GetListItemFeedback?db_name='
}

export const ApiGetUserStatus = (userid, db_name, page, handleData) => GET_DATA(Api._getStatus + `userid=${userid}&db_name=${db_name}&page=${page}`, res => {
    handleData(res);
})

export const ApiGetUserOrder = (userid, db_name, page, handleData) => GET_DATA(Api._getOrder + `userid=${userid}&db_name=${db_name}&page=${page}`, res => {
    handleData(res);
})

export const ApiPostFeedback = (data, handleData) => POST_DATA(Api._feeback, data, res => {
    handleData(res);
})

export const ApiGetListFeedback = (db_name, handleData) => GET_DATA(Api._list_fb + db_name, res => {
    handleData(res);
})


