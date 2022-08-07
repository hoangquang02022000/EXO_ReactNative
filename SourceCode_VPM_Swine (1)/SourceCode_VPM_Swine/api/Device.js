import { Path } from './Path';
import { GET_DATA, POST_DATA } from './Fetch';

export const Api = {
    _getMachineInfo: Path.API + 'GetMachineInfo?code={code}&userid={userid}&db_name=',
    _getErrorList: Path.API + 'GetListError?db_name=',
}

export const ApiGetMachineInfo = (code, userid, db_name, handleData) => GET_DATA(Api._getError + code +'&user=' + userid + '&db_name=' + db_name, res => {
    handleData(res);
})

export const getErrorList = (db, handleData) => GET_DATA(Api._getErrorList + db, res => {
    handleData(res);
})


