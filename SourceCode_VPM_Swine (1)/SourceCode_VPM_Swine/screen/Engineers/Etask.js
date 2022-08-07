import { Button, Container, Content, Tab, Tabs, Text, Thumbnail } from 'native-base';
import React, { Component } from 'react';
import { Alert, RefreshControl, View } from 'react-native';
import { ApiApproveJob, ApiGetListJob } from '../../api/TheJob';
import { ApiGetUserOrder } from '../../api/Status';
import { ApiChangeStatus } from '../../api/Task';
import Myheader from '../../components/Myheader';
import { GetUserLocal } from '../../func';
import Spinner from 'react-native-loading-spinner-overlay';

class Etask extends Component {
	state = {
		data: [],
		user: null,
		listJob: [],
		refreshing: false,
		spinner: false
	}

	async componentDidMount() {
		this.setState({ refreshing: true, spinner: true })
		let user = await GetUserLocal();
		ApiGetUserOrder(user.userid, user.db_name, 1, res => {
			this.setState({ data: res, user})
		})

		ApiGetListJob(user.userid, user.db_name, 1, res => {
			this.setState({ listJob: res, spinner: false })
		})
		this.setState({ refreshing: false })

		setTimeout(() => {
			this.setState({ spinner: false })
		}, 3000);

	}

	handleAction = (action, id) => {
		Alert.alert("Thông báo", "Bạn chắc chắn là tiến hành công việc này?", [
			{
				text: "Đồng ý", onPress: () => {
					let { user } = this.state;
					ApiChangeStatus(id, action, user.userid, user.db_name, "", res => {
						if (res === 'success') {
							Alert.alert("Thông báo", "Đã chuyển sang trạng thái việc đang làm");
							this.componentDidMount();
							this.props.navigation.navigate("Status")
						}
					})
				}
			},
			{
				text: "Không"
			}
		])
	}

	handleApprove = async (approve, id) => {
		let user = await GetUserLocal();
		Alert.alert("Thông báo", "Tiến hành công việc này?", [
			{
				text: "Tiến hành", onPress: () => {
					ApiApproveJob(id, approve, user.userid, user.db_name, "", res => {
						this.componentDidMount();
					})
				}
			},
			{ text: "Không" }
		])
	}

	render() {
		let { data, listJob } = this.state;
		let viewList = data.map((item, i) => {
			return <View key={i} style={{
				margin: 15
			}}>
				<Text style={{ marginBottom: 10, fontWeight: "bold" }}>{item.orderdate}</Text>
				<View style={{
					backgroundColor: "white",
					borderRadius: 15,
					padding: 20,
					borderLeftWidth: 5,
					borderLeftColor: "blue",
					marginBottom: 15
				}}>
					<Text style={{ marginBottom: 10, fontWeight: "bold", textTransform: "uppercase", color: "green" }}>{item.wono}</Text>
					<Text style={{ marginBottom: 10, fontWeight: "bold", textTransform: "capitalize" }}>{item.mc_name_vn}</Text>
					<Text style={{ marginBottom: 10, color: "#333", textTransform: "lowercase" }}>{item.er_name_vn}</Text>
					<View style={{
						flexDirection: "row",
						justifyContent: "flex-start",
						borderBottomWidth: 1,
						paddingBottom: 15,
						borderBottomColor: "#ddd",
						marginBottom: 10
					}}>
						{
							item.wo_image.map(img => {
								return <Thumbnail style={{ marginRight: 5, borderRadius: 5 }} large square source={{ uri: img.file_name }} />
							})
						}
					</View>

					<Text style={{ fontSize: 14, marginTop: 5, marginBottom: 10 }}>Thông tin người yêu cầu</Text>
					<Text style={{ marginBottom: 10, fontWeight: "bold" }}>{item.user_name_vn}</Text>
					<Button full style={{ borderRadius: 5 }} onPress={() => this.handleAction(1, item.id)}><Text uppercase={false}>Tiến hành</Text></Button>
				</View>
			</View>
		})

		let viewListJob = listJob.map((item, i) => {

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

					<Text style={{ fontSize: 14, marginTop: 5, marginBottom: 10, fontWeight: "bold" }}>Chi tiết bảo trì</Text>
					<Text style={{ marginBottom: 10 }}>{item.pm_details}</Text>
					<View style={{
						flexDirection: "row",
						justifyContent: "center"
					}}>
						<Button danger style={{ marginRight: 5 }} onPress={() => this.props.navigation.navigate("Edelay", { data: item })}><Text>Dời lịch</Text></Button>
						<Button style={{ marginRight: 5 }} onPress={() => this.handleApprove(1, item.id)}><Text>Tiến hành</Text></Button>
					</View>
				</View>
			</View>
		})
		return (
			<Container style={{ backgroundColor: "#f1f1f1" }}>
				<Spinner
					visible={this.state.spinner}
					textContent={'Loading...'}
				/>
				<Myheader {...this.props} goBack={false} title="Tác vụ" />

				<Tabs>
					<Tab activeTabStyle={{ backgroundColor: "#fff" }} activeTextStyle={{ color: "#000", fontWeight: "bold" }} tabStyle={{ backgroundColor: "#fff" }} textStyle={{ color: "#000" }} heading="Đơn yêu cầu">
						<Content style={{ backgroundColor: "#f1f1f1" }} refreshControl={
							<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.componentDidMount()} />
						}>
							{data.length > 0 ? viewList : <Text style={{ textAlign: "center", margin: 20 }}>Chưa có tác vụ nào</Text>}
						</Content>
					</Tab>
					<Tab activeTabStyle={{ backgroundColor: "#fff" }} activeTextStyle={{ color: "#000", fontWeight: "bold" }} tabStyle={{ backgroundColor: "#fff" }} textStyle={{ color: "#000" }} heading="Bảo trì">
						<Content style={{ backgroundColor: "#f1f1f1" }} refreshControl={
							<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.componentDidMount()} />
						}>
							{viewListJob}
						</Content>
					</Tab>
				</Tabs>

			</Container>
		);
	}
}

export default Etask;