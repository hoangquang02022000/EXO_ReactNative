import { Path } from './Path';
import { GET_DATA, POST_DATA, POST_FORM_DATA } from './Fetch';

export const Api = {
    _getStatus: Path.API + 'ApproveWO?',
    _assign: Path.API + 'AssignWO?',
    _postStatus: Path.API + 'PostApproveWO?'
}

export const ApiChangeStatus = (wo_id, approve, userid, db_name, note, handleData) => GET_DATA(Api._getStatus + `wo_id=${wo_id}&approve=${approve}&userid=${userid}&db_name=${db_name}&wo_note=${note}`, res => {
    handleData(res);
})

export const ApiPostStatus = (wo_id, approve, userid, db_name, note, data, handleData) => POST_FORM_DATA(Api._postStatus + `wo_id=${wo_id}&approve=${approve}&userid=${userid}&db_name=${db_name}&wo_note=${note}`, data, res => {
    handleData(res);
})

export const ApiAssign = (wo_id, engineer_id, manager_id, db_name, handleData) => GET_DATA(Api._assign + `wo_id=${wo_id}&engineer_id=${engineer_id}&manager_id=${manager_id}&db_name=${db_name}`, res => {
    handleData(res);
})


