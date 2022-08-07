import { Button, Container, Content, Item, Label, Tab, Tabs, Text, Textarea } from 'native-base';
import React, { Component } from 'react';
import { View, Alert, RefreshControl } from 'react-native';
import Myheader from '../../components/Myheader';
import { ApiGetUserStatus } from '../../api/Status';
import { CurrentTime, GetUserLocal, TimeToString, UserType } from '../../func';
import StatusItem from '../../components/StatusItem';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ApiPostJob } from '../../api/TheJob';
class Edelay extends Component {
    state = {
        data: [],
        page: 1,
        date: CurrentTime(),
        note: "",
        refreshing: false
    }

    handleDateChange = (event, value) => {
        let fixDate = TimeToString(value);
        this.setState({ date: fixDate })

    }

    handleSend = async () => {
        let { data } = this.props.route.params;
        let user = await GetUserLocal();
        let postData = {
            job_id: data.id,
            req_time: this.state.date,
            req_note: this.state.note,
            userid: user.userid,
            db_name: user.db_name
        }
        Alert.alert("Thông báo", "Xác nhận yêu cầu dời lịch", [
            {
                text: "Đồng ý",
                onPress: () => {
                    ApiPostJob(postData, res => {
                        if (res === "success") {
                            Alert.alert("Thông báo", "Đã gởi yêu cầu dời lịch");
                            this.props.navigation.goBack();
                        }
                    })
                }

            },
            {
                text: "Không"
            }
        ])

    }

    handleNote = (note) => {
        this.setState({ note })
    }


    render() {
        let { date } = this.state;
        let { data } = this.props.route.params;
        return (
            <Container style={{ backgroundColor: "#f1f1f1" }}>
                <Myheader {...this.props} goBack={true} title="Bảo trì" />
                <Content refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.componentDidMount()} />
                }>
                    <View style={{ backgroundColor: "#fff", margin: 15, padding: 15, borderRadius: 5 }}>
                        <Text style={{ textAlign: "center", fontWeight: "bold", marginBottom: 20 }}>YÊU CẦU DỜI LỊCH</Text>
                        <Text>{data.mc_name_vn}</Text>
                        <Text style={{ marginBottom: 30, color: "green" }}>Nội dung: {data.pm_name}</Text>
                        <Label style={{ fontSize: 14, color: "gray" }}>Ngày mong muốn</Label>
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={new Date(date)}
                            mode={'date'}
                            is24Hour={true}
                            display="default"
                            onChange={this.handleDateChange}

                        />
                        <Item regular style={{ marginTop: 30 }}>
                            <Textarea onChangeText={this.handleNote} placeholder="Ghi chú" rowSpan={3}></Textarea>
                        </Item>

                        <Button onPress={this.handleSend} full rounded style={{ marginTop: 15 }}><Text uppercase={false}>Gởi yêu cầu</Text></Button>

                    </View>
                </Content>
            </Container>
        );
    }
}

export default Edelay;