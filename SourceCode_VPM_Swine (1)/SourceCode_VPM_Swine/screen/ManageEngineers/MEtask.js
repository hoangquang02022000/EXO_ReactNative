import { Button, Container, Content, Icon, Item, Picker, Text, Thumbnail, Tabs, Tab } from 'native-base';
import React, { Component } from 'react';
import { Alert, RefreshControl, View } from 'react-native';
import { ApiAssignJob, ApiAssignWo, ApiGetListJob } from '../../api/TheJob';
import { ApiGetUserOrder } from '../../api/Status';
import { ApiGetListEngineer } from '../../api/User';
import Myheader from '../../components/Myheader';
import { GetUserLocal, VpmPushNotification } from '../../func';
import Spinner from 'react-native-loading-spinner-overlay';
import { log } from 'react-native-reanimated';

class MEtask extends Component {
	state = {
		data: [],
		user: null,
		listE: [],
		Engineer: "",
		listJob: [],
		refreshing: false,
		spinner: false
	}

	async componentDidMount() {
		this.setState({ refreshing: true, spinner: true })
		let user = await GetUserLocal();
		ApiGetUserOrder(user.userid, user.db_name, 1, res => {
			this.setState({ data: res, user, spinner: false })
		})

		ApiGetListEngineer(user.userid, user.db_name, res => {
			this.setState({ listE: res })
		})

		ApiGetListJob(user.userid, user.db_name, 1, res => {
			this.setState({ listJob: res })
		})
		this.setState({ refreshing: false })

		setTimeout(() => {
			this.setState({ spinner: false })
		}, 3000);
	}

	handleAction = (id) => {
		let { user, Engineer } = this.state;
		if (Engineer === "") {
			Alert.alert("Thông báo", "Vui lòng chọn kỹ thuật phụ trách")
			return false;
		}

		Alert.alert("Thông báo", "Giao việc cho kỹ thuật này?", [
			{
				text: "Đồng ý", onPress: () => {
					ApiAssignWo(id, Engineer, user.userid, user.db_name, res => {
						
						if (res === 'success') {
							VpmPushNotification("4", "Quản lý đã giao việc");
							Alert.alert("Thông báo", "Giao việc thành công", [
								{
									onPress: () => this.componentDidMount()
								}
							])
							
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

	handleAssign = async (id) => {
		let user = await GetUserLocal();
		if (this.state.Engineer === "") {
			Alert.alert("Thông báo", "Vui lòng chọn một kỹ thuật viên")
			return false;
		}
		Alert.alert("Thông báo", "Bạn chắc chắn là giao việc cho kỹ thuật này?", [
			{
				text: "Đồng ý",
				onPress: () => {
					ApiAssignJob(id, this.state.Engineer, user.userid, user.db_name, res => {
						VpmPushNotification("4", "Quản lý đã giao việc");
						if (res === "success") {
							Alert.alert("Thông báo", "Đã giao việc")
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
		let { data, listE, listJob } = this.state;

		let viewListE = listE.map((item, i) => {
			return <Picker.Item key={i} value={item.userid} label={item.name_vn === "" ? item.name_en : item.name_vn} />
		})

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
						{/* {
							item.wo_image.map(img => {
								return <Thumbnail style={{ marginRight: 5, borderRadius: 5 }} large square source={{ uri: img.file_name }} />
							})
						} */}
					</View>

					<Text style={{ fontSize: 14, marginTop: 5, marginBottom: 10 }}>Thông tin người yêu cầu</Text>
					<Text style={{ marginBottom: 10, fontWeight: "bold" }}>{item.user_name_vn}</Text>
					<View style={{}}>
						<Item picker>
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
						<Button full style={{ marginTop: 10, borderRadius: 5 }} onPress={() => this.handleAction(item.id)}><Text>Giao việc</Text></Button>
					</View>
				</View>
			</View>
		})

		//view list job

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
					borderLeftColor: item.job_status_code === "15" ? "red" : "blue",
					marginBottom: 15
				}}>
					{item.job_status_code === "15" && <Text style={{ marginBottom: 10, fontWeight: "bold", textTransform: "uppercase", color: "red" }}>Yêu cầu dời lịch</Text>}
					<Text style={{ marginBottom: 10, fontWeight: "bold", textTransform: "uppercase", color: "green" }}>{item.id}</Text>
					<Text style={{ marginBottom: 10, fontWeight: "bold", textTransform: "capitalize" }}>{item.mc_name_vn}</Text>
					<Text style={{ marginBottom: 10, color: "#333" }}>{item.pm_name}</Text>
					{item.job_status_code === "11" ? <View style={{}}>
						<Item picker>
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

						<Button full style={{ marginTop: 10, borderRadius: 5 }} onPress={() => this.handleAssign(item.id)}><Text>Giao việc</Text></Button>
					</View> :
						<Button full danger style={{ marginTop: 10, borderRadius: 5 }} onPress={() => this.props.navigation.navigate("MEdelay", { data: item })}><Text uppercase={false}>Chi tiết</Text></Button>
					}
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
							{viewList}
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

export default MEtask;