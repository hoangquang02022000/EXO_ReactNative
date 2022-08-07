import { Button, Container, Content, Item, List, Text, Textarea, ListItem, Body, Right, CheckBox } from 'native-base';
import React, { Component } from 'react';
import { Alert, RefreshControl, View } from 'react-native';
import Myheader from '../../components/Myheader';
import { ApiGetListFeedback, ApiGetUserStatus, ApiPostFeedback } from '../../api/Status';
import { GetUserLocal, stateCode } from '../../func';
import { Rating } from 'react-native-ratings';
import { Fragment } from 'react';
import { ApiChangeStatus } from '../../api/Task';

class UserRating extends Component {
    state = {
        data: [],
        point: 4,
        listFb: [],
        note: ""
    }

    getRated = (data) => {
        let tmp = [];
        data.forEach(item => {
            if (item.wo_state_code === stateCode.FixDone) {
                tmp.push(item);
            }
        })
        this.setState({ data: tmp })
    }

    async componentDidMount() {
        let user = await GetUserLocal();
        ApiGetUserStatus(user.userid, user.db_name, 1, res => {
            this.getRated(res);
        })

        ApiGetListFeedback(user.db_name, res => {
            let listFb = [];
            res.forEach(item => {
                item.it_value = 0;
                listFb.push(item);
            })
            this.setState({ listFb })
        })
    }

    handleRate = (point) => {
        this.setState({ point })
    }

    handleRating = async (item) => {

        let user = await GetUserLocal();
        let data = {
            wo_id: item.id,
            fb_point: this.state.point,
            userid: user.userid,
            db_name: user.db_name,
            list_fb: this.state.listFb
        }

        ApiPostFeedback(data, res => {
            if (res==="success"){
                Alert.alert("Thông báo","Gởi đánh giá thành công");
                this.props.navigation.navigate("UserStatus");
            }
        })
    }

    handleCheck = (value, index) => {
        let { listFb } = this.state;
        listFb[index].it_value = value;
        this.setState({ listFb });
    }

    handleNote = (note) => {
        this.setState({ note })
    }

    handleReWork = async (action, id) => {
        let { note } = this.state;
        if (note===""){
            Alert.alert("Thông báo","Vui lòng nhập ghi chú");
            return false;
        }

        let user = await GetUserLocal();
        ApiChangeStatus(id, action, user.userid, user.db_name, note, res => {
            if (res === "success") {
                Alert.alert("Thông báo", "Đã gởi yêu cầu làm lại", [
                    { text: "OK", onPress: () => this.componentDidMount() }
                ]);

            }
        })
    }

    render() {
        let { data, listFb } = this.state;
        let viewListFb = listFb.map((item, i) => {
            let value = item.it_value === 0 ? false : true;
            return <ListItem key={i} style={{ paddingLeft: 0 }} noIndent>
                <Body><Text>{item.it_name}</Text></Body>
                <Right>
                    <View style={{ flexDirection: "row" }}>
                        <Fragment>
                            <CheckBox onPress={() => this.handleCheck(0, i)} style={{ marginRight: 25 }} checked={!value} />
                            <CheckBox onPress={() => this.handleCheck(1, i)} checked={value} />
                        </Fragment>
                    </View>
                </Right>
            </ListItem>
        })

        let listRating = data.map((item, i) => {
            return <View key={i} style={{
                backgroundColor: "#fff",
                padding: 20,
                margin: 15,
                borderRadius: 15
            }}>
                <Text style={{ fontSize: 25, textAlign: "center", marginBottom: 30 }}>Yêu cầu làm lại</Text>
                <Text style={{ marginBottom: 5, textTransform: "capitalize", fontWeight: "bold" }}>{item.mc_name_vn}</Text>
                <Text style={{ marginBottom: 10, color: "#333", textTransform: "lowercase" }}>{item.er_name_vn}</Text>
                <View style={{ borderBottomWidth: 1, borderBottomColor: "#ddd", marginBottom: 15 }}></View>

                <Text style={{ marginBottom: 5, fontSize: 14, color: "#666" }}>Kỹ thuật viên</Text>
                <Text style={{ marginBottom: 10, color: "#333", fontWeight: "bold" }}>{item.wo_history[item.wo_history.length - 1].userid}</Text>
                <View style={{ borderBottomWidth: 1, borderBottomColor: "#ddd", marginBottom: 15 }}></View>

                <Item regular style={{ marginBottom: 20 }}>
                    <Textarea onChangeText={this.handleNote} placeholder="Note"></Textarea>
                </Item>

                <Button full danger rounded onPress={() => this.handleReWork(0, item.id)}><Text uppercase={false}>Yêu cầu làm lại</Text></Button>

                <View style={{ marginTop: 20 }}>
                    <Rating
                        showRating
                        style={{ paddingVertical: 10 }}
                        ratingCount={5}
                        startingValue={this.state.point}
                        showRating={false}
                        imageSize={30}
                        onFinishRating={this.handleRate}
                    />
                </View>

                <List>
                    <ListItem style={{ paddingLeft: 0 }} noIndent>
                        <Body></Body>
                        <Right>
                            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                <Text style={{ fontSize: 12, marginRight: 5 }}>No</Text>
                                <Text style={{ fontSize: 12, marginLeft: 10 }}>Yes</Text>
                            </View>
                        </Right>
                    </ListItem>
                    {viewListFb}

                </List>

                <Button onPress={() => this.handleRating(item)} style={{ marginTop: 15 }} success full rounded><Text uppercase={false}>Gởi đánh giá</Text></Button>
            </View>
        })
        return (
            <Container style={{ backgroundColor: "#f1f1f1" }}>
                <Myheader {...this.props} goBack={false} title="Đánh giá" />
                <Content refreshControl={
                    <RefreshControl onRefresh={() => this.componentDidMount()} />
                }>
                    {data.length > 0 ? listRating : <Text style={{ margin: 20, textAlign: "center" }}>Chưa có công việc hoàn thành</Text>}
                </Content>
            </Container>
        );
    }
}

export default UserRating;