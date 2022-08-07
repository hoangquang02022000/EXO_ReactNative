import { Button, Container, Content, Tab, Tabs, Text, Textarea } from 'native-base';
import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import Myheader from '../../components/Myheader';
import Timeline from 'react-native-timeline-flatlist'
import { CheckUserRule, GetUserLocal, UserType, VpmPushNotification } from '../../func';
import { ApiApproveJob } from '../../api/TheJob';

class EDetailJobStatus extends Component {
    state = {
        rule: ""
    }
    handleFinish = async () => {
        let user = await GetUserLocal();
        let { data } = this.props.route.params;

        Alert.alert("Thông báo", "Bạn chắc là đã hoàn thành công việc?", [
            {
                text: "Hoàn thành", onPress: () => {
                    ApiApproveJob(data.id, "2", user.userid, user.db_name, "", res => {
                        if (res === 'success') {
                            VpmPushNotification("4", "Kỹ thuật đã hoàn thành công việc");
                            Alert.alert("Thông báo", "Đã hoàn thành");
                            this.props.navigation.goBack();
                        }
                    })
                }
            },
            {text: "Chưa"}
        ])
    }

    async componentDidMount() {
        let rule = await CheckUserRule();
        this.setState({ rule })
    }

    render() {
        let { data } = this.props.route.params;
        let time = data.job_history;
        let timeline = [];
        time.forEach(item => {
            let obj = {
                // time: item.history_date,
                title: item.history_date,
                description: item.job_status_name
            }
            timeline.push(obj);
        });

        return (
            <Container style={{ backgroundColor: "#f1f1f1" }}>
                <Myheader {...this.props} goBack={false} title="Trạng thái" />
                <Content>
                    <View style={{
                        margin: 15
                    }}>
                        <Text style={{ marginBottom: 10, fontWeight: "bold" }}>{data.pm_time}</Text>
                        <View style={{
                            backgroundColor: "white",
                            borderRadius: 15,
                            padding: 20,
                            borderLeftWidth: 5,
                            borderLeftColor: "blue",
                            marginBottom: 15
                        }}>
                            <Text style={{ marginBottom: 10, fontWeight: "bold", textTransform: "uppercase", color: "green" }}>{data.id}</Text>
                            <Text style={{ marginBottom: 10, fontWeight: "bold", textTransform: "capitalize" }}>{data.mc_name_vn}</Text>
                            <Text style={{ marginBottom: 10, color: "#333" }}>{data.pm_name}</Text>

                            <View style={{ borderTopWidth: 1, borderTopColor: "gray", paddingTop: 15, marginTop: 10 }}>
                                <Timeline
                                    // timeStyle={{ textAlign: 'center', backgroundColor: '#f1f1f1', color: '#000', padding: 5, borderRadius: 13 }}
                                    data={timeline}
                                    showTime={false}
                                    titleStyle={{ fontWeight: "bold" }}
                                />
                            </View>

                            {(this.state.rule === UserType.Engineer && data.job_status_code !== "13") ?<Button onPress={this.handleFinish} full rounded><Text uppercase={false}>Hoàn thành</Text></Button>:null}
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}

export default EDetailJobStatus;