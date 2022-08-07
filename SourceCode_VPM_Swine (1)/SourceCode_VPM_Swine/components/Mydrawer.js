import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { Button, Container, Text, Icon } from 'native-base';
import React, { Component } from 'react';
import { View } from 'react-native';
import { GetUserLocal } from '../func';

class Mydrawer extends Component {
    state = {
        user: null
    }


    handleLogout = async () => {
        await AsyncStorage.removeItem("user");
        this.props.navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [
                    { name: 'Login' }
                ],
            })
        );
        this.props.navigation.toggleDrawer();
    }

    async componentWillReceiveProps() {
        let user = await GetUserLocal();
        this.setState({ user })
    }

    render() {
        let { user } = this.state;
        console.log("user Mydrawer: ", user)
        let viewInfo = null;
        if (user !== null) {
            viewInfo = <View style={{
                backgroundColor: "#024BC5",
                height: 200,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Icon style={{ color: "#fff", fontSize: 150 }} name="user" type="EvilIcons" />
                <Text style={{ color: "#fff" }}>{user.name_vn}</Text>
            </View>
        }else{
            viewInfo = <View style={{
                backgroundColor: "#024BC5",
                height: 200,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Icon style={{ color: "#fff", fontSize: 150 }} name="user" type="EvilIcons" />
                <Text style={{ color: "#fff" }}>Khách</Text>
            </View>
        }
        return (
            <Container>
                {viewInfo}
                <View style={{ padding: 15, marginTop:15 }}>
                    <Text style={{fontWeight:"bold", marginBottom:5}}>Liên hệ phòng IT</Text>
                    <Text>Email: it_feedback@cp.com.vn</Text>
                </View>
                <View style={{ padding: 15 }}>
                    {user!==null&&<Button onPress={this.handleLogout} full rounded><Text uppercase={false}>Đăng xuất</Text></Button>}
                </View>
            </Container>
        );
    }
}

export default Mydrawer;
