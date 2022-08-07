import { Button, Container, Content, Text } from 'native-base';
import React, { Component } from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
import Myheader from '../../components/Myheader';
import { ApiGetUserStatus } from '../../api/Status';
import { GetUserLocal } from '../../func';
import StatusItem from '../../components/StatusItem';
import Spinner from 'react-native-loading-spinner-overlay';

class UserStatus extends Component {
    state = {
        data: [],
        page: 1,
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
            // res.forEach(item => {
            //     if (item.wono==="BR-2021-7"){
            //         console.log(item);
            //     }
            // });
            this.setState({ data: res, page: 1, sp: false })
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
        let { data } = this.state;
        let viewStatus = data.map((item, i) => {
            return <StatusItem
                key={i}
                {...this.props}
                wo_state_code={item.wo_state_code}
                wono={item.wono}
                mc_name_vn={item.mc_name_vn}
                er_name_vn={item.er_name_vn}
                wo_image={item.wo_image}
                wo_image_result={item.wo_image_result}
                wo_state_name={item.wo_state_name}
                data={item} />
        })
        return (
            <Container style={{ backgroundColor: "#f1f1f1" }}>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Loading...'}
                />
                <Myheader {...this.props} goBack={false} title="Trạng thái" />
                <Content refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.componentDidMount()} />
                }>
                    <View style={{
                        margin: 15
                    }}>
                        {/* <Text style={{marginBottom:10, fontWeight:"bold"}}>09/12/2020</Text> */}
                        {viewStatus}
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "center", padding: 15, paddingTop: 0 }}>
                        <Button onPress={this.handleLoadMore} rounded small><Text uppercase={false}>Tải thêm</Text></Button>
                    </View>
                </Content>
            </Container>
        );
    }
}

export default UserStatus;

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