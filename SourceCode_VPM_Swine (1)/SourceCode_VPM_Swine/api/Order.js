import { Path } from './Path';
import { POST_DATA, GET_DATA, POST_FORM_DATA, POST_FORM_DATA_CENTER } from './Fetch';

export const Api = {
    _request: Path.API + 'PostFormData?',
    _request_Image: Path.API + 'PostImgMaintenanceMachine?',
    _request_center: Path.API_CENTER,
    _request_report: Path.API,
}

export const UserRequestFix = (data, handleData) => POST_FORM_DATA_CENTER(
    Api._request_center,
    data,
    res => {
        handleData(res)
    }
)
export const UserRequestReport = (url, handleData) => GET_DATA(
    Api._request_report + url,
    res => {
        console.log(Api._request_report + url)
        handleData(res)
    }
)
export const UserRequestFix_Image = (org_code, userid, formData, handleData) => POST_FORM_DATA(
    Api._request_Image +`org_code=${org_code}&user_create=${userid}`,
    formData,
    res => {
        //console.log(Api._request_Image +`org_code=${org_code}&user_create=${userid}`)
        handleData(res)
    }
)
// export const UserRequestFix = (mc_code, error_code, date, userid, db_name, formData, handleData) => POST_FORM_DATA(
//     Api._request + `mc_code=${mc_code}&error_code=${error_code}&date=${date}&userid=${userid}&db_name=${db_name}`,
//     formData,
//     res => {
//         handleData(res)
//     }
// )

export const ApiLogin = (data, handleData) => POST_DATA(Api._login, data, res => {
    handleData(res);
});
