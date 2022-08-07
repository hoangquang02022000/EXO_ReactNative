import { Button, Container, Content, Item, Picker, Text, Icon } from 'native-base';
import React, { Component } from 'react';
import { View, Alert, RefreshControl } from 'react-native';
import Myheader from '../../components/Myheader';
import { GetUserLocal } from '../../func';
import { ApiGetListEngineer } from '../../api/User';
import { ApiAssignJob, ApiAcceptRequestTime } from '../../api/TheJob';

class MEdelay extends Component {
    state = {
        listE: [],
        Engineer: "",
        refreshing: false
    }

    async componentDidMount() {
        this.setState({ refreshing: true })
        let user = await GetUserLocal();
        let { data } = this.props.route.params;
        let engineer = data.job_request[0].req_create_by;
        ApiGetListEngineer(user.userid, user.db_name, res => {
            // console.log(res);
            let newArr = res.filter(item => item.userid !== engineer);
            this.setState({ listE: newArr })
        })
        this.setState({ refreshing: false })
    }

    handleAssign = async (id) => {
        let user = await GetUserLocal();
        if (this.state.Engineer === "") {
            Alert.alert("Thông báo", "Vui lòng chọn một kỹ thuật viên")
            return false;
        }
        Alert.alert("Thông báo", "Giao việc cho kỹ thuật này?", [
            {
                text: "Đồng ý",
                onPress: () => {
                    ApiAssignJob(id, this.state.Engineer, user.userid, user.db_name, res => {
                        if (res === 'success') {
                            Alert.alert("Thông báo", "Giao việc thành công")
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
    chooseEngineer = (value) => {
        this.setState({ Engineer: value })
    }

    handleAgree = async (id) => {
        let user = await GetUserLocal();
        let { data } = this.props.route.params;
        let time = data.pm_time.split(" ");
        Alert.alert("Thông báo", "Đồng ý dời lịch", [
            {
                text: "Đồng ý",
                onPress: () => {
                    ApiAcceptRequestTime(id, time[0], user.db_name, res => {
                        if (res === 'success') {
                            Alert.alert("Thông báo", "Dời lịch thành công");
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

    render() {
        let { data } = this.props.route.params;
        let { listE } = this.state;

        let viewListE = listE.map((item, i) => {
            return <Picker.Item key={i} value={item.userid} label={item.name_vn} />
        })
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
                        <Text style={{ fontSize: 14, color: "gray" }}>Ngày mong muốn</Text>
                        <Text style={{ fontSize: 16 }}>{data.job_request[0].req_time}</Text>
                        <Text>{data.job_note}</Text>
                        <Button success onPress={() => this.handleAgree(data.id)} full rounded style={{ marginTop: 15 }}><Text uppercase={false}>Đồng ý</Text></Button>

                    </View>

                    <View style={{ backgroundColor: "#fff", margin: 15, padding: 15, borderRadius: 5 }}>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "center"
                        }}>
                            <Item>
                                <Picker
                                    placeholder="Chọn kỹ thuật"
                                    onValueChange={this.chooseEngineer}
                                    selectedValue={this.state.Engineer}
                                    iosIcon={<Icon type="FontAwesome5" name="caret-down" />}
                                    placeholderStyle={{ color: "#000" }}
                                >
                                    {viewListE}
                                </Picker>
                            </Item>

                            <Button style={{ marginRight: 5 }} onPress={() => this.handleAssign(data.id)}><Text>Giao việc</Text></Button>
                        </View>
                    </View>

                </Content>
            </Container>
        );
    }
}

export default MEdelay;