import axios from "axios";
const apiKey = 'yhTMTlGGQyPKhlr8IHKMHc4mB7qo3R5t';

export const POST_DATA_WITHOUT_AUTH = (Url, Data, handleData) => {
    axios.post(Url, Data, {
        headers:{
            "content-type":"application/json",
            "host":"exp.host",
            "accept-encoding":"gzip, deflate",
            "accept": "application/json"
        }
    }).then(res => {
        handleData(res.data);
    });
}

export const GET_DATA = (Url, handleData) => {
    axios.get(Url, {
        headers: {
            'Authorization': apiKey
        }
    }).then(res => {
        handleData(res.data);
    });
}

export const GET_DATA_WITH_BODY = (Url, Body, handleData) => {
    axios.get(Url, {
        params: Body,
        headers: {
            'Authorization': apiKey
        }
    }).then(res => {
        handleData(res.data);
    });
}

export const POST_DATA = (Url, Data, handleData) => {
    axios.post(Url, Data, {
        headers: {
            'Authorization': apiKey
        }
    }).then(res => {
        handleData(res.data);
    });
}
export const POST_FORM_DATA_CENTER = (Url, Data, handleData) => {
    axios.post(Url, Data, {
        // headers: {
        //     //'Content-Type': 'multipart/form-data', SQL01UAT btR/RLAB95C2XR9pxSYnaQ==
        //     'Authorization': apiKey
        // }
        // headers:{
        //     "content-type":"application/json", CPV01SQL sK5Z3Yp3TzDyGzSfuZOxmA==
        //     "host":"exp.host",
        //     "accept-encoding":"gzip, deflate",
        //     "accept": "application/json"
        // },
        auth: {
            username: "CPV01SQL",
            password: "sK5Z3Yp3TzDyGzSfuZOxmA=="
          }
    }).then(res => {
        handleData(res.data);
    }).catch(function(error) {
        console.log('Error on Authentication: ', error);
      });
}

export const POST_FORM_DATA = (Url, Data, handleData) => {
    axios.post(Url, Data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': apiKey
        }
    }).then(res => {
        handleData(res.data);
    });
}

export const POST_DATA_LOGIN = (Url, Data, handleData) => {
    axios.post(Url, Data).then(res => {
        handleData(res.data);
    });
}