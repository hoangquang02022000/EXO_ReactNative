import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input, Item, Button, Text, Picker, Icon } from 'native-base';
import React, { Component, Fragment } from 'react';
import { View, Dimensions, Image, Alert } from 'react-native';
import { ApiRegister } from '../api/User';
import logo from '../assets/logo.png';
import Spinner from 'react-native-loading-spinner-overlay';

const { height } = Dimensions.get("screen");

class Register extends Component {

    state = {
        Email: "",
        Password: "",
        Retype: "",
        spinner: false
    }

    handleRegister = async () => {
        
        let { Email, Password, Retype } = this.state;
        if (Email === "") {
            Alert.alert("Thông báo", "Vui lòng nhập username");
            return false;
        }
        if (Password === "") {
            Alert.alert("Thông báo", "Vui lòng nhập password");
            return false;
        }
        if (Password !== Retype) {
            Alert.alert("Thông báo", "Nhập lại mật khẩu không đúng");
            return false;
        }
        let data = {
            userid: Email,
            pwd: Password
        }
        this.setState({spinner: true})
        ApiRegister(data, res => {
            if (res === 'success') {
                Alert.alert("Thông báo! ", "Thành công!")
                this.props.navigation.navigate("Login")
            } else {
                Alert.alert("Thông báo", "Không đăng ký được, người dùng đã tồn tại");
            }
            this.setState({spinner: false})
        })
    }

    handleInput = (key, value) => {
        let obj = [];
        obj[key] = value;
        this.setState(obj);
    }



    render() {
        return (
            <View style={{
                flex: 1,
                height
            }}>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Loading...'}
                />
                <View style={{
                    flex: 1,
                    padding: 45,
                    flexDirection: "column",
                    justifyContent: "center",
                    backgroundColor: "white",
                    alignItems: "center"
                }}>
                    <Image source={logo} style={{ height: 150, marginBottom: 20 }} resizeMode="contain" />
                    <Text style={{
                        fontSize: 24,
                        fontWeight: "600",
                        marginBottom: 20,
                        textAlign: "center"
                    }}>Đăng ký</Text>

                    <Fragment>
                        <Item style={{}}>
                            <Input autoCorrect={false} onChangeText={(value) => this.handleInput("Email", value)} placeholder="Username" autoCapitalize="none" />
                        </Item>
                        <Item style={{}}>
                            <Input onChangeText={(value) => this.handleInput("Password", value)} placeholder="Password" secureTextEntry />
                        </Item>
                        <Item style={{}}>
                            <Input onChangeText={(value) => this.handleInput("Retype", value)} placeholder="Re-type password" secureTextEntry />
                        </Item>
                        <Button onPress={this.handleRegister} full style={{ borderRadius: 30, marginTop: 10 }}><Text uppercase={false}>Đăng ký</Text></Button>
                        <Button onPress={() => this.props.navigation.goBack()} full style={{ marginTop: 20 }} transparent><Text uppercase={false}>Quay lại</Text></Button>
                    </Fragment>
                    {/* <Button full style={{ borderRadius: 30, marginTop: 10, backgroundColor: "#DEEDFD" }}><Text style={{ color: "#2E6EF4" }} uppercase={false}>Đăng ký</Text></Button> */}
                    <Text style={{ fontSize: 12, textAlign: "center", marginTop: 10 }}>Không thể đăng ký? Vui lòng liên hệ IT Helpdesk</Text>

                </View>
            </View>

        );
    }
}

export default Register;
