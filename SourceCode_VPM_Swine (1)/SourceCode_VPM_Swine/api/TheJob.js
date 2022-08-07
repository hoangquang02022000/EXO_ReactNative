import { Path } from './Path';
import { GET_DATA, POST_DATA, POST_FORM_DATA } from './Fetch';

export const Api = {
    _getList: Path.API + 'GetListJOB?',
    _approve: Path.API + 'ApproveJOB?',
    _assignJob: Path.API + 'AssignJOB?',
    _assignWo: Path.API + 'AssignWO?',
    _postJob: Path.API + 'PostJOBRequest',
    _acceptTime: Path.API + 'ApproveJOBRequestTime?',
    _listJobStatus: Path.API + 'GetListJOBInfo?'
}

export const ApiGetListJob = (userid, db_name, page, handleData) => GET_DATA(Api._getList + `userid=${userid}&db_name=${db_name}&page=${page}`, res => {
    handleData(res);
})

export const ApiGetJobStatus = (userid, db_name, page, handleData) => GET_DATA(Api._listJobStatus + `userid=${userid}&db_name=${db_name}&page=${page}`, res => {
    handleData(res);
})

export const ApiApproveJob = (job_id, approve, userid, db_name, job_note, handleData) => GET_DATA(Api._approve + `job_id=${job_id}&approve=${approve}&userid=${userid}&db_name=${db_name}&job_note=${job_note}`, res => {
    handleData(res);
})

export const ApiPostJob = (data, handleData) => POST_DATA(Api._postJob, data, res => {
    handleData(res);
})

export const ApiAssignJob = (wo_id, engineer_id, manager_id, db_name, handleData) => GET_DATA(Api._assignJob + `wo_id=${wo_id}&engineer_id=${engineer_id}&manager_id=${manager_id}&db_name=${db_name}`, res => {
    handleData(res);
})

export const ApiAssignWo = (wo_id, engineer_id, manager_id, db_name, handleData) => GET_DATA(Api._assignWo + `wo_id=${wo_id}&engineer_id=${engineer_id}&manager_id=${manager_id}&db_name=${db_name}`, res => {
    handleData(res);
})

export const ApiAcceptRequestTime = (job_id, pm_time, db_name, handleData) => GET_DATA(Api._acceptTime + `job_id=${job_id}&pm_time=${pm_time}&db_name=${db_name}`, res => {
    handleData(res);
})


