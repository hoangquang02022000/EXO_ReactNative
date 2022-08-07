import { Button, Container, Content, Input, Item, Text, Thumbnail } from 'native-base';
import React, { Component } from 'react';
import { Alert, View, Modal, Dimensions, RefreshControl } from 'react-native';
import { ApiGetUserOrder } from '../../api/Status';
import { ApiChangeStatus } from '../../api/Task';
import Myheader from '../../components/Myheader';
import { GetUserLocal, VpmPushNotification } from '../../func';
import ImageView from 'react-native-image-view';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';

class MUtask extends Component {
	state = {
		data: [],
		user: null,
		modal: false,
		id: null,
		reason: "",
		show: false,
		images: [],
		refreshing: false,
		spinner: false
	}

	showImage = (item) => {
		let arr = [];
		item.wo_image.forEach((item, i) => {
			let obj = {
				source: {
					uri: item.file_name,
				},
				title: 'Ảnh ' + i,
				width: 806,
				height: 720,
			}
			arr.push(obj)
		})
		this.setState({ images: arr, show: true })

	}

	Close = () => {
		this.setState({ show: false })
	}

	async componentDidMount() {
		this.setState({ refreshing: true, spinner: true })
		let user = await GetUserLocal();
		ApiGetUserOrder(user.userid, user.db_name, 1, res => {
			this.setState({ data: res, user, spinner: false })
		})
		this.setState({ refreshing: false })

		setTimeout(() => {
			this.setState({ spinner: false })
		}, 3000);
	}

	handleAction = (action, id) => {
		this.setState({ modal: false })
		let { user, reason } = this.state;
		if (action === 1) {
			Alert.alert("Thông báo", "Duyệt yêu cầu này?", [
				{
					text: "Đồng ý", onPress: () => {
						ApiChangeStatus(id, action, user.userid, user.db_name, reason, res => {
							if (res === "success") {
								VpmPushNotification("1", "Yêu cầu của bạn đã được duyệt");
								VpmPushNotification("3", "Có yêu cầu mới");
								Alert.alert("Thông báo", "Đã xong", [
									{ text: "OK", onPress: () => this.componentDidMount() }
								]);

							}
						})
					}
				}, {
					text: "Không"
				}
			])
		} else {
			VpmPushNotification("1", "Yêu cầu của bạn không được duyệt");
			ApiChangeStatus(id, action, user.userid, user.db_name, reason, res => {
				if (res === "success") {
					Alert.alert("Thông báo", "Đã xong", [
						{ text: "OK", onPress: () => this.componentDidMount() }
					]);

				}
			})
		}

	}

	handleModal = (id) => {
		this.setState({ modal: !this.state.modal, id })
	}

	handleReason = (value) => {
		this.setState({ reason: value })
	}

	render() {
		let { data } = this.state;

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
								return <TouchableOpacity onPress={() => this.showImage(item)}><Thumbnail style={{ marginRight: 5, borderRadius: 5 }} large square source={{ uri: img.file_name }} /></TouchableOpacity>
							})
						}
					</View>

					<Text style={{ fontSize: 14, marginTop: 5, marginBottom: 10 }}>Thông tin người yêu cầu</Text>
					<Text style={{ marginBottom: 10, fontWeight: "bold" }}>{item.user_name_vn}</Text>
					<View style={{
						flexDirection: "row",
						justifyContent: "center"
					}}>
						<Button style={{ marginRight: 5, borderRadius: 5 }} onPress={() => this.handleAction(1, item.id)}><Text>Duyệt đơn</Text></Button>
						<Button style={{borderRadius:5}} danger onPress={() => this.handleModal(item.id)}><Text>Từ chối</Text></Button>
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
				<Content refreshControl={
					<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.componentDidMount()} />
				}>
					{data.length > 0 ? viewList : <Text style={{ textAlign: "center", margin: 20 }}>Chưa có tác vụ nào</Text>}
				</Content>
				<ImageView
					images={this.state.images}
					imageIndex={0}
					onClose={this.Close}
					isVisible={this.state.show}
				/>
				<Modal visible={this.state.modal} transparent>
					<View style={{ flex: 1, flexDirection: "column", height: Dimensions.get("screen").height, justifyContent: "center", backgroundColor: 'rgba(0,0,0,0.7)' }}>
						<View style={{
							backgroundColor: "#fff",
							height: 200,
							margin: 10,
							padding: 10
						}}>
							<Text style={{
								fontWeight: "bold",
								fontSize: 20,
								textAlign: "center",
								margin: 20
							}}>Lý do từ chối</Text>
							<Item regular>
								<Input onChangeText={this.handleReason} placeholder="Nhập lý do" />
							</Item>
							<View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
								<Button onPress={() => this.handleAction(0, this.state.id)} style={{ marginRight: 10 }}><Text>Nhập</Text></Button>
								<Button danger onPress={this.handleModal}><Text>Đóng</Text></Button>
							</View>
						</View>
					</View>
				</Modal>

			</Container>
		);
	}
}

export default MUtask;