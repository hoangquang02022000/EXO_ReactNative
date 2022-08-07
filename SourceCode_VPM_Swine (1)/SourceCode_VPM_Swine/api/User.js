import { Path } from './Path';
import { GET_DATA, POST_DATA_LOGIN, POST_DATA_WITHOUT_AUTH } from './Fetch';

export const Api = {
    _getInfo: Path.API + 'GetUserInfo?userid=',
    _login: Path.API + 'Login',
    _userActive: Path.API + 'GetVacation?',
    _userUpdateActive: Path.API + 'UpdateVacation?',
    _listEngineer: Path.API +'GetListEnginner?',
    _pushNoti: 'https://exp.host/--/api/v2/push/send',
    _register: Path.API + 'SignUp',
    _registerManager: Path.API + 'SignUpManager',
}

export const ApiRegister = (data, handleData) => POST_DATA_LOGIN(Api._register, data, res => {
    handleData(res);
});
export const ApiRegisterManager = (data, handleData) => POST_DATA_LOGIN(Api._registerManager, data, res => {
    handleData(res);
});

export const PushNotification = (data, handleData) => POST_DATA_WITHOUT_AUTH(Api._pushNoti, data, res => {
    handleData(res);
})

export const ApiLogin = (data, handleData) => POST_DATA_LOGIN(Api._login, data, res => {
    handleData(res);
});

export const ApiGetUserInfo = (id, db, handleData) => GET_DATA(Api._getInfo + id + '&db_name=' + db, res => {
    handleData(res);
})

export const ApiGetListEngineer = (userid, db_name, handleData) => GET_DATA(Api._listEngineer + `userid=${userid}&db_name=${db_name}`, res => {
    handleData(res);
})

export const ApiUserActive = (userid, db_name, handleData) => GET_DATA(Api._userActive + `userid=${userid}&db_name=${db_name}`, res => {
    handleData(res);
})

export const ApiUserUpdateActive = (vc_status, userid, db_name, handleData) => GET_DATA(Api._userUpdateActive + `vc_status=${vc_status}&userid=${userid}&db_name=${db_name}`, res => {
    handleData(res);
})




