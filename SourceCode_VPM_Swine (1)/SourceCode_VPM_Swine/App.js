LogBox.ignoreAllLogs();
import React, { Component } from 'react';
import { Root, Text, Icon } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LogBox } from 'react-native';
import Login from './screen/Login';
import Order from './screen/Order';
import Task from './screen/Task';
import Status from './screen/Status';
import Rating from './screen/Rating';
import Report from './screen/Report';
import { CheckUserRule, UserType } from './func';
import Empty from './screen/Empty';
import UserStatus from './screen/Users/UserStatus';
import UserDetailStatus from './screen/Users/UserDetailStatus';
import UserRating from './screen/Users/UserRating';
import ScanQR from './screen/Users/ScanQR';
import MUtask from './screen/ManageUsers/MUtask';
import MURegister from './screen/ManageUsers/MURegister';
import Mydrawer from './components/Mydrawer';
import EDetailStatus from './screen/Engineers/EDetailStatus';
import Edelay from './screen/Engineers/Edelay';
import MEdelay from './screen/ManageEngineers/MEdelay';
import EDetailJobStatus from './screen/Engineers/EDetailJobStatus';
import Register from './screen/Register';
import {decode, encode} from 'base-64';

if (!global.btoa) {  global.btoa = encode }

if (!global.atob) { global.atob = decode }
//navigation
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
class Views extends Component {
	state = {
		rule: ""
	}
	async componentDidMount() {
		
		let rule = await CheckUserRule();
		this.setState({ rule })
		
	}
	render() {
		let { rule } = this.state;
		return (
			<Tab.Navigator
				screenOptions={({ route }) => ({
					tabBarIcon: ({ color }) => {
						if (route.name === 'Home') {
							return <Icon type="SimpleLineIcons" name='home' style={{ fontSize: 21, color: color }} />;
						} else if (route.name === 'Order') {
							return <Icon type="SimpleLineIcons" name='notebook' style={{ fontSize: 21, color: color }} />;
						} else if (route.name === 'Task') {
							return <Icon type="FontAwesome5" name='calendar-check' style={{ fontSize: 21, color: color }} />;
						} else if (route.name === 'Status') {
							return <Icon type="MaterialCommunityIcons" name='timetable' style={{ fontSize: 21, color: color }} />;
						} else if (route.name === 'Rating') {
							return <Icon type="FontAwesome5" name='tools' style={{ fontSize: 21, color: color }} />;
						} else if (route.name === 'Report') {
							return <Icon type="SimpleLineIcons" name='pie-chart' style={{ fontSize: 21, color: color }} />;
						}
						else if (route.name === 'Task2') {
							return <Icon type="FontAwesome5" name='calendar-check' style={{ fontSize: 21, color: color }} />;
						}
						else if (route.name === 'MURegister') {
							return <Icon type="SimpleLineIcons" name='notebook' style={{ fontSize: 21, color: color }} />;
						}
					},
					tabBarLabel: () => {
						let labelText = '';
						if (route.name === 'Home') {
							labelText = "Home";
						}
						if (route.name === 'Order') {
							labelText = "";
						}
						if (route.name === 'Task') {
							labelText = "";
						}
						if (route.name === 'Task2') {
							labelText = "";
						}
						if (route.name === 'Status') {
							labelText = "";
						}
						if (route.name === 'Rating') {
							labelText = "";
						}
						if (route.name === 'Report') {
							labelText = "";
						}
						if (route.name === 'MURegister') {
							labelText = "";
						}
						return <Text style={{ fontSize: 13, color: "#333" }}>{labelText}</Text>;
					},

				})}
				tabBarOptions={{
					activeTintColor: '#024BC5',
					inactiveTintColor: 'gray',//rule === UserType.ManageUser || 

				}}
			>
				{(rule === UserType.ManageUser ) && <Tab.Screen name="MURegister" component={MURegister} />}
				{rule === "" && <Tab.Screen name="Empty" component={Empty} />}
				{(rule === UserType.User) && <Tab.Screen name="Order" component={Order} />}
				{(rule === UserType.Engineer|| rule === UserType.ManageEngineer) && <Tab.Screen name="Task" component={Task} />}
				{(rule === UserType.User) && <Tab.Screen name="Status" component={Status} />}
				{(rule === UserType.User || rule === UserType.ManageUser) && <Tab.Screen name="Task" component={Task} />}
				{(rule === UserType.User) && <Tab.Screen name="Rating" component={Rating} />}
				{(rule === UserType.ManageUser ) && <Tab.Screen name="Report" component={Report} />}
				
			</Tab.Navigator>
		);
	}
}

class App extends Component {
	render() {
		return (
			<Stack.Navigator>
				<Stack.Screen name="Root" component={Login} options={{ headerShown: false }} />
				<Stack.Screen name="Home" component={Views} options={{ headerShown: false }} />
				<Stack.Screen name="UserStatus" component={UserStatus} options={{ headerShown: false }} />
				<Stack.Screen name="UserDetailStatus" component={UserDetailStatus} options={{ headerShown: false }} />
				<Stack.Screen name="UserRating" component={UserRating} options={{ headerShown: false }} />
				<Stack.Screen name="ScanQR" component={ScanQR} options={{ headerShown: false }} />
				<Stack.Screen name="Order" component={Order} options={{ headerShown: false }} />
				<Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
				<Stack.Screen name="MUstatus" component={MUtask} options={{ headerShown: false }} />
				<Stack.Screen name="MURegister" component={MURegister} options={{ headerShown: false }} />
				<Stack.Screen name="EDetailStatus" component={EDetailStatus} options={{ headerShown: false }} />
				<Stack.Screen name="Edelay" component={Edelay} options={{ headerShown: false }} />
				<Stack.Screen name="MEdelay" component={MEdelay} options={{ headerShown: false }} />
				<Stack.Screen name="EDetailJobStatus" component={EDetailJobStatus} options={{ headerShown: false }} />
				<Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
			</Stack.Navigator>
		);
	}
}

class RootApp extends Component {
	render() {
		return (
			<Root>
				<NavigationContainer>
					<Drawer.Navigator drawerContent={(props) => <Mydrawer {...props} />}>
						<Drawer.Screen name="App" component={App} />
					</Drawer.Navigator>
				</NavigationContainer>
			</Root>
		)
	}
}
export default RootApp;
