import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input, Item, Button, Text, Picker, Icon } from 'native-base';
import React, { Component, Fragment } from 'react';
import { View, Dimensions, Image, Alert } from 'react-native';
import { ApiGetUserInfo, ApiLogin } from '../api/User';

//import { fireStore, firebaseApp } from '../Fire';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications'
import { CheckUserRule } from '../func';
import Spinner from 'react-native-loading-spinner-overlay';
import { isEmpty, isEmptyMayPhat } from '../components/Validate';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const { height } = Dimensions.get("screen");

class Login extends Component {

    state = {
        films: [],
        query: '',
        username: "",//khanhjp9
        password: "",
        step: 1,
        listBA: [{ db_name: "" ,
        code: "",
        nameth: ""}],
        db_name: null,
        token: "",
        spinner: false
    }

    componentDidMount() {
        
        this.registerForPushNotificationsAsync();
        //this.handleLogin(1);
    }

    registerForPushNotificationsAsync = async () => {
        const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            return;
        }

        let token = await Notifications.getExpoPushTokenAsync();
        let tokenKey = token.data;

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        this.setState({ token: tokenKey })
    }

    handleLogin = async (s) => {
        let { username, password, db_name, token } = this.state;
        console.log("login: ", s)
        this.setState({ spinner: true });
        // setTimeout(() => {
        //     this.setState({ spinner: false })
        // }, 200);
        let checkUser = isEmptyMayPhat(username, "t??i kho???n!");
        if(!checkUser)
        {
            return false;
        }
        let checkPass = isEmptyMayPhat(password, "m???t kh???u!");
        if(!checkPass)
        {
            return false;
        }

        
        if ((username && password) !== null) {
            
            let data = {
                userid: username,
                pwd: password
                // userid: "test5",
                // pwd: "test5"
            }
            if (s === 1) {
                console.log("data: ", data);     
                ApiLogin(data, async res => {
                    console.log("res: ", res); 
                    if (res.result === true) { 
                        console.log("ApiLogin: ", res);
                        console.log("res.listBA: ", res.listBA);                       
                        if (res.listBA.length > 1) {
                            console.log("step: 2: ", res.listBA);
                            await AsyncStorage.setItem("listBA", JSON.stringify(res.listBA));    
                            this.setState({ step: 2, listBA: res.listBA, db_name:  res.listBA[0].db_name})
                        } 
                        else {
                            ApiGetUserInfo(username, res.listBA[0].db_name, async res1 => {
                                res1.db_name = res.listBA[0].db_name;
                                console.log("ApiGetUserInfo 1: ", res1);   
                                await AsyncStorage.setItem("user", JSON.stringify(res1));

                                //update admin key
                                let rule = await CheckUserRule();
                                // firebaseApp.auth().signInWithEmailAndPassword("vo.hieu@cp.com.vn", "ffffff").then(() => {
                                //     if (Constants.isDevice){
                                //         if (token!==""){
                                //             fireStore.collection("tokens").doc(`${token}`).set({ token: token, type: rule, id: username });
                                //         }
                                        
                                //     }
                                    
                                // })

                                //this.setState({ spinner: false })
                                this.props.navigation.replace("Home");
                            })
                            
                        }
                        this.setState({ spinner: false })
                    } 
                    else 
                    {
                        this.setState({ spinner: false })
                        Alert.alert("Th??ng b??o", "T??i kho???n ho???c m???t kh???u kh??ng ????ng!")
                    }

                })
            } else 
            {
                console.log("join step: 2: ")
                if (db_name !== null) {
                    console.log("db_name: ", db_name);
                    console.log("username: ", username);
                    ApiGetUserInfo(username, db_name, async res => {
                        console.log("db_name !== null: ", JSON.stringify(res));
                        res.db_name = db_name;
                        await AsyncStorage.setItem("user", JSON.stringify(res));
                        //this.setState({ spinner: false })
                        this.props.navigation.replace("Home");
                    })
                } else {
                    Alert.alert("Th??ng b??o", "Vui l??ng ch???n nh?? m??y")
                }
            }

        } else {
            Alert.alert("Th??ng b??o", "Vui l??ng nh???p ?????y ????? th??ng tin")
        }

    

    }

    handleInput = (key, value) => {
        let obj = [];
        obj[key] = value;
        this.setState(obj);
    }

    
    findFilm(query) {
        if (query === '') {
          return [];
        }
    
        const { films } = this.state;
        const regex = new RegExp(`${query.trim()}`, 'i');
        return films.filter(film => film.title.search(regex) >= 0);
    }
    render() {
        let { step, listBA, db_name, code, nameth, films} = this.state;

        let viewBA = listBA.map((item, i) => {
            return <Picker.Item key={i} value={item.db_name} label={item.ba_name} />
        })
        //console.log("films: ", this.state.films)
        const { query } = this.state;
        let arr = this.state.films;
        //console.log("arr1: ", arr)
        //const films = this.findFilm(query); //films.length === 1 && comp(query, films[0].title) ? [] : 
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
        

        return (
            <View style={{
                flex: 1,
                height
            }}>
                <Spinner
                    visible={this.state.spinner}
                    textContent={''}
                />

                <View style={{
                    flex: 1,
                    padding: 45,
                    flexDirection: "column",
                    justifyContent: "center",
                    backgroundColor: "white",
                    alignItems: "center"
                }}>
                    <Image style={{ height: 150, marginBottom: 30 }} resizeMode="contain" source={require('../assets/logo.png')} />
                    <Text style={{
                        fontSize: 24,
                        fontWeight: "600",
                        marginBottom: 20,
                        textAlign: "center"
                    }}>????ng nh???p</Text>

                    {step === 1 && <Fragment>
                        
                       
                       
                        <Item style={{}}>
                            <Input onChangeText={(value) => this.handleInput("username", value)} defaultValue={this.state.username} value={this.state.username}  placeholder="Username" autoCapitalize="none" />
                        </Item>
                        <Item style={{}}>
                            <Input onChangeText={(value) => this.handleInput("password", value)} defaultValue={this.state.password} value={this.state.password} placeholder="Password" secureTextEntry />
                        </Item>

                        <Button onPress={() => this.handleLogin(1)} full style={{ borderRadius: 30, marginTop: 20 }}><Text uppercase={false}>????ng nh???p</Text></Button>
                    </Fragment>}
                    {step === 2 && <Fragment>
                        <Item picker>
                            <Picker selectedValue={db_name} onValueChange={(value) => this.handleInput("db_name", value)} placeholder="Nh???p ch???n nh?? m??y" iosIcon={<Icon name="arrow-down" />}>
                                {viewBA}
                            </Picker>
                        </Item>
                        <Button success onPress={() => this.handleLogin(2)} full style={{ borderRadius: 30, marginTop: 20 }}><Text uppercase={false}>Ti???p t???c</Text></Button>
                    </Fragment>}
                    <Button onPress={() => this.props.navigation.navigate("Register")} full style={{ borderRadius: 30, marginTop: 10, backgroundColor: "#DEEDFD" }}><Text style={{ color: "#2E6EF4" }} uppercase={false}>????ng k??</Text></Button>
                    <Text style={{ fontSize: 12, textAlign: "center", marginTop: 10 }}>Kh??ng th??? ????ng nh???p? Vui l??ng li??n h??? IT Helpdesk</Text>

                    <Image style={{ height: 50, marginTop: 60 }} resizeMode="contain" source={require('../assets/footer.png')} />
                </View>
            </View>

        );
    }
}


export default Login;
