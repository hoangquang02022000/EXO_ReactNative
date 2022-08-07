import AsyncStorage from "@react-native-async-storage/async-storage";
// import { firebaseApp, fireStore } from "./Fire";
// import { PushNotification } from "./api/User";

export const VpmPushNotification = async(type, message) => {
    //push notification
    // firebaseApp.auth().signInWithEmailAndPassword("vo.hieu@cp.com.vn", "ffffff").then(async () => {
    //     const users = fireStore.collection('tokens');
    //     const snapshot = await users.get();
    //     let listUser = [];
    //     snapshot.forEach(doc => {
    //         let obj = {
    //             "to": doc.data().token,
    //             "sound": "default",
    //             "body": message,
    //             "title": "VPM Food",
    //         }
    //         if (doc.data().type === type) {
    //             listUser.push(obj)
    //         }
    //         PushNotification(listUser, res=>{})
    //     });
    // });
}

export const CheckUserRule = async() => {
    let local = await AsyncStorage.getItem("user");
    let rule = JSON.parse(local).type_code;
    return rule;
}

export const GetUserLocal = async() => {
    let local = await AsyncStorage.getItem("user");
    let user = JSON.parse(local);
    return user;
}

export const UserType = {
    User: "1",
    ManageUser:"2",
    Engineer: "3",
    ManageEngineer: "4"
}

export const stateCode = {
    Rated:"15",
    FixDone: "14"
}

export const CurrentTime = () => {
    let date = new Date();
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" +  (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();
    // let h = date.getHours();
    // let m = date.getMinutes();
    // let s = date.getSeconds();
    let str = year + "-" + month + "-" + day;
    return str;
}

export const TimeToString = (value) => {
    let date = new Date(value);
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" +  (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();
    // let h = date.getHours();
    // let m = date.getMinutes();
    // let s = date.getSeconds();
    let str = year + "-" + month + "-" + day;
    return str;
}


export const IntToTime = (number) => {
    if (number !== undefined) {
        const timestamp = Number(number) + (7 * 3600);
        let date = new Date(timestamp * 1000);
        let Day = date.getUTCDate();

        if (Day.toString().length === 1) {
            Day = "0" + Day;
        }

        let Month = date.getUTCMonth() + 1;
        if (Month.toString().length === 1) {
            Month = "0" + Month;
        }

        let Year = date.getUTCFullYear();

        let H = date.getUTCHours();
        if (H.toString().length === 1) {
            H = "0" + H;
        }

        let M = date.getUTCMinutes();
        if (M.toString().length === 1) {
            M = "0" + M;
        }

        let fulltime = Day + '-' + Month + '-' + Year + ' ' + H + ':' + M;
        return fulltime;
    }
    return "";
};


// import { Button, Container, Content} from 'native-base';
// import React, { Component } from 'react';
// import { View } from 'react-native';
// import Myheader from '../../components/Myheader';
// import DateTimePicker from '@react-native-community/datetimepicker';

// class UserOrder extends Component {
// 	state = {
// 		showDate: false
// 	}

// 	showDate = () => {
// 		this.setState({ showDate: true })
// 	}

// 	render() {
// 		return (
// 			<Container style={{ backgroundColor: "#f1f1f1" }}>
// 				<Myheader {...this.props} goBack={false} title="Đơn yêu cầu" />
// 				<Content>
					
// 				</Content>
// 			</Container>
// 		);
// 	}
// }

// export default UserOrder;