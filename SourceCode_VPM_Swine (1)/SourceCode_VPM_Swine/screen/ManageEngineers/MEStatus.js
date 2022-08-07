import { Button, Container, Content, Text, Tabs, Tab } from 'native-base';
import React, { Component } from 'react';
import { Dimensions, View, StyleSheet, RefreshControl } from 'react-native';
import Myheader from '../../components/Myheader';
import * as Progress from 'react-native-progress';
import { ApiGetUserStatus } from '../../api/Status';
import { GetUserLocal } from '../../func';
import StatusItem from '../../components/StatusItem';
import { ApiGetJobStatus } from '../../api/TheJob';
import Spinner from 'react-native-loading-spinner-overlay';

class MEStatus extends Component {
    state = {
        data: [],
        page: 1,
        page1: 1,
        jobStatus: [],
        refreshing: false,
        spinner: false
    }

    showDate = () => {
        this.setState({ showDate: true })
    }

    async componentDidMount() {
        this.setState({ refreshing: true, spinner: true })
        let user = await GetUserLocal();
        ApiGetUserStatus(user.userid, user.db_name, 1, res => {
            this.setState({ data: res, page: 1, spinner: false })
        })
        ApiGetJobStatus(user.userid, user.db_name, 1, res => {
            this.setState({ jobStatus: res, page1: 1 })
        })
        this.setState({ refreshing: false })

        setTimeout(() => {
            this.setState({ spinner: false })
        }, 3000);
    }

    handleLoadMore = async () => {
        let { page } = this.state;
        let nextPage = page + 1;
        let user = await GetUserLocal();
        ApiGetUserStatus(user.userid, user.db_name, nextPage, res => {
            this.setState({ data: this.state.data.concat(res), page: nextPage })
        })
    }

    render() {
        let { data, jobStatus } = this.state;
        let viewStatus = data.map(item => {
            return <StatusItem
                {...this.props}
                key={item.id}
                wo_state_code={item.wo_state_code}
                wono={item.wono}
                mc_name_vn={item.mc_name_vn}
                er_name_vn={item.er_name_vn}
                wo_image={item.wo_image}
                wo_state_name={item.wo_state_name}
                data={item} />
        })

        let viewJobStatus = jobStatus.map((item, i) => {
            let bar = 0.01;
            let bg = "blue";
            switch (item.job_status_code) {
                case "11":
                    bar = 0.01;
                    break;
                case "12":
                    bar = 0.5;
                    bg = "#ffcc29"
                    break;
                case "13":
                    bar = 1;
                    bg = "#61b15a"
                    break;
                case "14":
                    bar = 0.75;
                    bg = "#51c2d5"
                    break;
                case "15":
                    bar = 1;
                    bg = "#61b15a"
                    break;
                case "16":
                    bar = 0.01;
                    bg = "#ff0000"
                    break;
                case "17":
                    bar = 0.25;
                    bg = "#ffcc29"
                    break;
                default:
                    break;
            }

            return <View key={i} style={{
                margin: 15
            }}>
                <Text style={{ marginBottom: 10, fontWeight: "bold" }}>{item.pm_time}</Text>
                <View style={{
                    backgroundColor: "white",
                    borderRadius: 15,
                    padding: 20,
                    borderLeftWidth: 5,
                    borderLeftColor: "blue",
                    marginBottom: 15
                }}>
                    <Text style={{ marginBottom: 10, fontWeight: "bold", textTransform: "uppercase", color: "green" }}>{item.id}</Text>
                    <Text style={{ marginBottom: 10, fontWeight: "bold", textTransform: "capitalize" }}>{item.mc_name_vn}</Text>
                    <Text style={{ marginBottom: 10, color: "#333" }}>{item.pm_name}</Text>

                    <Progress.Bar color={bg} progress={bar} width={Dimensions.get("screen").width - 74} />
                    <Text style={{ marginTop: 5, marginBottom: 10 }}>{item.job_status_name}</Text>

                    <Button full style={{ borderRadius: 5 }} onPress={() => this.props.navigation.navigate("EDetailJobStatus", { data: item })}><Text uppercase={false}>Chi tiết</Text></Button>
                </View>
            </View>
        })

        return (
            <Container style={{ backgroundColor: "#f1f1f1" }}>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Loading...'}
                />
                <Myheader {...this.props} goBack={false} title="Trạng thái" />
                <Tabs>
                    <Tab activeTabStyle={{ backgroundColor: "#fff" }} activeTextStyle={{ color: "#000", fontWeight: "bold" }} tabStyle={{ backgroundColor: "#fff" }} textStyle={{ color: "#000" }} heading="Đơn yêu cầu">
                        <Content style={{ backgroundColor: "#f1f1f1" }} refreshControl={
                            <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.componentDidMount()} />
                        }>
                            <View style={{
                                margin: 15
                            }}>
                                {viewStatus}
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "center", padding: 15, paddingTop: 0 }}>
                                <Button onPress={this.handleLoadMore} light rounded small><Text uppercase={false}>Tải thêm</Text></Button>
                            </View>
                        </Content>
                    </Tab>
                    <Tab activeTabStyle={{ backgroundColor: "#fff" }} activeTextStyle={{ color: "#000", fontWeight: "bold" }} tabStyle={{ backgroundColor: "#fff" }} textStyle={{ color: "#000" }} heading="Bảo trì">
                        <Content style={{ backgroundColor: "#f1f1f1" }} refreshControl={
                            <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.componentDidMount()} />
                        }>
                            {viewJobStatus}
                        </Content>
                    </Tab>
                </Tabs>
            </Container>
        );
    }
}

export default MEStatus;

const style = StyleSheet.create({
    itemStatus: {
        flexDirection: "row",
        justifyContent: "flex-start",
        borderBottomWidth: 1,
        paddingBottom: 15,
        borderBottomColor: "#ddd",
        marginBottom: 10
    }
})