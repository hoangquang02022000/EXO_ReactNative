import React, { Component } from 'react';
import { Dimensions, Platform } from 'react-native';
import { Header, Left, Body, Right, Title, Button, Icon, Switch } from 'native-base';
import { Fragment } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ApiUserActive, ApiUserUpdateActive } from '../api/User';
import { CheckUserRule, GetUserLocal, UserType } from '../func';
const { width } = Dimensions.get('screen');

class Myheader extends Component {
	state = {
		active: 0,
		rule: ""
	}

	async componentDidMount() {
		let rule = await CheckUserRule();
		this.setState({ rule })
		let user = await GetUserLocal();
		ApiUserActive(user.userid, user.db_name, res => {
			let active = false;
			if (res === "1") {
				active = true;
			}
			this.setState({ active })
		})
	}

	handleActive = async (active) => {
		let user = await GetUserLocal();
		let value = "";
		if (active) {
			value = "1"
		} else {
			value = "0"
		}
		ApiUserUpdateActive(value, user.userid, user.db_name, res => {
			// console.log(res);
		})
		this.setState({ active })
	}

	render() {
		//define button go back
		let btnGoBack = this.props.goBack ? <Left><Button onPress={() => this.props.navigation.goBack()} transparent>
			<Icon name='md-arrow-back' style={{ color: "#fff" }} />
		</Button></Left> : <Left><Button onPress={() => this.props.navigation.toggleDrawer()} transparent>
			<Icon name='ios-menu' style={{ color: "#fff" }} />
		</Button></Left>;

		//define title
		let viewTitle = this.props.title !== null && <Body style={{ alignItems: "center" }}>
			<Title style={{ color: "#fff" }}>{this.props.title}</Title>
		</Body>

		return (
			<Fragment>
				<LinearGradient
					start={{ x: 0, y: 1 }}
					end={{ x: 1, y: 1 }}
					colors={["#024BC5", "#5991FB"]}
				>
					<Header
						iosBarStyle="light-content"
						androidStatusBarColor="transparent"
						noShadow
						searchBar
						transparent
						style={{ height: Platform.OS === "ios" ? 50 : 65, flexDirection: this.props.search ? "column" : "row" }}
					>
						{btnGoBack}
						{viewTitle}
						<Right>
							{this.state.rule === UserType.Engineer && <Switch onValueChange={this.handleActive} value={this.state.active} ios_backgroundColor="#eee" />}
						</Right>
					</Header>
				</LinearGradient>
			</Fragment>
		);
	}
}


Myheader.defaultProps = {
	title: null,
	goBack: true,
	isHome: false,
	bg: '#008c44',
	showCart: true,
	search: false
}

export default Myheader;

