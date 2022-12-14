import { Container, Content, Text, Button } from 'native-base';
import React, { Component } from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
import Myheader from '../../components/Myheader';
import { ApiGetUserStatus } from '../../api/Status';
import { GetUserLocal } from '../../func';
import StatusItem from '../../components/StatusItem';
import Spinner from 'react-native-loading-spinner-overlay';

class MUStatus extends Component {
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
            this.setState({ data: res, page: 1, spinner: false })
        })
        this.setState({ refreshing: false });

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
        let viewStatus = data.map(item => {

            return <StatusItem
                {...this.props}
                wo_state_code={item.wo_state_code}
                wono={item.wono}
                mc_name_vn={item.mc_name_vn}
                er_name_vn={item.er_name_vn}
                wo_image={item.wo_image}
                wo_state_name={item.wo_state_name}
                data={item} />
        })
        return (
            <Container style={{ backgroundColor: "#f1f1f1" }}>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Loading...'}
                />

                <Myheader {...this.props} goBack={false} title="Tr???ng th??i" />
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
                        <Button onPress={this.handleLoadMore} rounded small><Text uppercase={false}>T???i th??m</Text></Button>
                    </View>
                </Content>
            </Container>
        );
    }
}

export default MUStatus;

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