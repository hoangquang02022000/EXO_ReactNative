import { Button, Container, Content, Icon, Input, Item, Label, Picker, Text } from 'native-base';
import React, { Component } from 'react';
import { Modal, View, StyleSheet, Alert, Platform, AsyncStorage } from 'react-native';
import Myheader from '../../components/Myheader';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getErrorList } from '../../api/Device';
import { CurrentTime, GetUserLocal, TimeToString } from '../../func';
import * as ImagePicker from 'expo-image-picker';
import { UserRequestFix } from '../../api/Order';
import ScanQR from './ScanQR';
import { isEmpty, isEmptyMayPhat } from '../../components/Validate';
import Spinner from 'react-native-loading-spinner-overlay';
import { Path } from '../../api/Path';

class UserMayPhat extends Component {
    state = {
        showDate: false,
        imgNumber: 0,
        submit: () => { },
        modal: false,
        images: [],
        errorList: [],
        scan: false,

        error_code: null,
        date: CurrentTime(),
        userid: null,
        db_name: null,
        mc_code: "",
        mc_name: "",
        mc_hours: 0,
        mc_hours_today: 0,
        mc_STANDARD_OIL: 0,
        mc_CONSUME: 0,
        spinner: false
    }

    handleModal = () => {
        this.setState({ modal: !this.state.modal })
    }

    handleError = (error) => {
        this.setState({ error_code: error })
    }

    showDate = () => {
        this.setState({ showDate: true })
    }

    async componentDidMount() {
        let user = await GetUserLocal();
        let { mc_code, mc_name, mc_CONSUME} = this.state;
        mc_code = await AsyncStorage.getItem("mc_code");
        mc_name = await AsyncStorage.getItem("mc_name");
        mc_CONSUME = await AsyncStorage.getItem("mc_CONSUME");
        console.log("mc_code: ", mc_code);
        this.setState({ userid: user.userid, db_name: user.db_name, 
            mc_code: JSON.parse(mc_code), mc_name: JSON.parse(mc_name), mc_CONSUME: mc_CONSUME })
        getErrorList(user.db_name, res => {
            this.setState({ errorList: res })
        })
        this.getTOTAL_HOURS(JSON.parse(mc_code), this.state.date);
    }

    getTOTAL_HOURS = (data, date) => {
        this.setState({ scan: false, mc_code: data })
        let { userid, mc_code, db_name, mc_hours, mc_hours_today} = this.state;
        this.setState({ spinner: true });  
        let fdata = [
            db_name,
            data,
            date,
            userid    
        ]
        console.log("data: ", fdata);
        let strUser = {
            "DataBaseName": Path.DataBaseName,
            "StoreProcedureName": "sp_GET_InfoMachine_Total_Hours_Today",
            "Params": fdata
        }
        console.log("strUser: ", strUser);
        UserRequestFix(strUser, res => {
            console.log("UserRequestFix: ", JSON.parse(res));
            JSON.parse(res).map((item, i) => {
                this.setState({mc_hours_today: (item.TOTAL_HOURS)})
              })
            // console.log("mc_WATTAGE: ", this.state.mc_WATTAGE);
            
        })

        setTimeout(() => {
            this.setState({ spinner: false })
        }, 3000);
    }

    renderSelectedComponent = (number) => (
        <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{number}</Text>
        </View>
    );
    updateHandler = (count, onSubmit) => {
        this.setState({ submit: onSubmit, imgNumber: count })
    };


    handleDateChange = (event, value) => {
        if (value !== undefined) {
            let fixDate = TimeToString(value);
            this.getTOTAL_HOURS(this.state.mc_code, fixDate);
            this.setState({ date: fixDate, showDate: false })
        } else {
            this.setState({ showDate: false })
        }

    }

    pickImage = async (number) => {
        let { images } = this.state;
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true
        });
        if (!result.cancelled) {
            let uri = result.uri;
            let name = (result.uri).split('/').pop();
            let match = /\.(\w+)$/.exec(name);
            let type = match ? `image/${match[1]}` : `image`;
            let obj = { uri, name, type }

            switch (number) {
                case "0":
                    images[0] = obj;
                    break;
                case "1":
                    images[1] = obj;
                    break;
                case "2":
                    images[2] = obj;
                    break;
                default:
                    break;
            }
        }
        this.setState({ images })
    };

    handleMcCode = (mc_code) => {
        this.setState({ mc_code })
    }
    handleMcName = (mc_name) => {
        this.setState({ mc_name })
    }
    
    handleMcSTANDARD_OIL = (mc_STANDARD_OIL) => {
        this.setState({ mc_STANDARD_OIL })
    }
    handleMcdate = (mc_date) => {
        this.setState({ mc_date })
    }
    
    handleMchours = (mc_hours) => {
        let {mc_STANDARD_OIL, mc_CONSUME} =this.state;
        mc_STANDARD_OIL = mc_CONSUME * mc_hours;
        console.log(mc_STANDARD_OIL)
        this.setState({ mc_hours: mc_hours,  mc_STANDARD_OIL: mc_STANDARD_OIL})
    }

    handleRequestFix = () => {

        let { userid, images, error_code, date, mc_code, mc_name, mc_hours, mc_STANDARD_OIL, db_name } = this.state;

        let checkMc_Code = isEmpty(mc_code, "thiết bị");
        if (!checkMc_Code) {
            return false;
        }

        let checkmc_hours = isEmptyMayPhat(mc_hours, "số giờ");
        if (!checkmc_hours) {
            return false;
        }

        let checkmc_STANDARD_OIL = isEmptyMayPhat(mc_STANDARD_OIL, "số lít nhiên liệu");
        if (!checkmc_STANDARD_OIL) {
            return false;
        }
        
        this.setState({ spinner: true });
        
        let data = [
            db_name,
            mc_code,
            mc_name,
            date,
            mc_hours,
            mc_STANDARD_OIL,
            userid    
        ]
        console.log("data: ", data);
        let strUser = {
            "DataBaseName": Path.DataBaseName,
            "StoreProcedureName": "sp_INS_UP_GeneratorMachine",
            "Params": data
        }
        console.log("strUser: ", strUser);
        UserRequestFix(strUser, res => {
            console.log("UserRequestFix: ", JSON.parse(res));
            JSON.parse(res).map((item, i) => {
                console.log("item: ", item.ERROR);
                if(item.ERROR === 1)
                {
                    Alert.alert("Thông báo! ", "Thành công!")
                    this.setState({                      
                        mc_STANDARD_OIL: 0,
                        
                        mc_hours: 0})
                    this.getTOTAL_HOURS(mc_code, date);
                }
                else if(item.ERROR !== 0 )
                {
                    Alert.alert("Thông báo! ", "Lỗi! Số lít nhiên liệu không được nhỏ hơn hoặc vượt quá " + item.ERROR + " %",[
                        { text: "OK"}
                    ]);
                }
                else
                {
                    Alert.alert("Thông báo! ", "Thất bại! Lỗi " + JSON.parse(res))
                }
              })
        })

        setTimeout(() => {
            this.setState({ spinner: false })
        }, 3000);
    }
    showQRScan = () => {
        this.setState({ scan: true })
    }

    closeScreen = () => {
        this.setState({ scan: false })
    }

    scanResult = (data) => {
        this.setState({ scan: false, mc_code: data })
        let { userid, images, error_code, date, mc_code, db_name, mc_name} = this.state;
        this.setState({ spinner: true });  
        let fdata = [
            db_name,
            data,
            userid    
        ]
        console.log("data: ", fdata);
        let strUser = {
            "DataBaseName": Path.DataBaseName,
            "StoreProcedureName": "sp_GET_InfoMachine",
            "Params": fdata
        }
        console.log("strUser: ", strUser);
        UserRequestFix(strUser, res => {
            console.log("UserRequestFix: ", JSON.parse(res));
            JSON.parse(res).map((item, i) => {
                this.setState({
                    mc_name: item.NAME_MACHINE
                    })
              })   
        })

        setTimeout(() => {
            this.setState({ spinner: false })
        }, 3000);
    }

    render() {

        let { date, errorList, error_code, images, mc_code, mc_name, mc_hours, mc_STANDARD_OIL, scan, showDate, mc_hours_today } = this.state;

        let viewErrorList = errorList.map((item, i) => {
            return <Picker.Item key={i} value={item.code} label={item.name_vn} />
        })
        return (
            <Container style={{ backgroundColor: "#f1f1f1" }}>
                <Myheader {...this.props} goBack={false} title="Máy phát điện" />
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Loading...'}
                />
                <Content>
                    <View style={{
                        backgroundColor: "#fff",
                        padding: 25,
                        margin: 15,
                        borderRadius: 15
                    }}>
                        {/* <Label style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>Mã máy</Label>
                        <Item>
                            <Input defaultValue={mc_code.toString()} placeholder="Nhập mã" editable={false} onChangeText={this.handleMcCode} />
                            <Button onPress={this.showQRScan} transparent icon><Icon name="qrcode-scan" type="MaterialCommunityIcons" /></Button>
                        </Item>
                        <Label style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>Tên máy</Label>
                        <Item>
                            <Input defaultValue={mc_name} placeholder="Tên máy" onChangeText={this.handleMcName} autoCorrect={false} keyboardType="default" autoCapitalize="none" />
                        </Item> */}
                        <Label style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>Ngày chạy máy</Label>
                        {
                            Platform.OS === "android" && <Button onPress={this.showDate} success><Icon name="calendar" /><Text>{date}</Text></Button>

                        }
                        {
                            Platform.OS === "ios" ? <DateTimePicker
                                testID="dateTimePicker"
                                value={new Date(date)}
                                mode={'date'}
                                is24Hour={true}
                                display="default"
                                accessibilityViewIsModal={false}
                                onChange={this.handleDateChange}

                            /> :
                                showDate && <DateTimePicker
                                    testID="dateTimePicker"
                                    value={new Date(date)}
                                    mode={'date'}
                                    is24Hour={true}
                                    display="default"
                                    accessibilityViewIsModal={false}
                                    onChange={this.handleDateChange}
                                    onTouchCancel={() => console.log(1)}
                                />
                        } 
                        <Label style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>Tổng giờ (h)</Label>
                        <Item>
                            <Input defaultValue={mc_hours} placeholder="Tổng giờ (h)" onChangeText={this.handleMchours} autoCorrect={false} keyboardType="phone-pad" autoCapitalize="none"/>
                        </Item>
                        <Label style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>Số lít NL (l)</Label>
                        <Item style={{ paddingBottom: 25 }}>
                            <Input value={mc_STANDARD_OIL.toString()} placeholder="Số lít NL (l)" onChangeText={this.handleMcSTANDARD_OIL} autoCorrect={false} keyboardType="phone-pad" autoCapitalize="none"/>
                        </Item>                        
                        <Label style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>Tổng số giờ (h)</Label>
                        <Item style={{ paddingBottom: 25 }}>
                            <Label>{mc_hours_today}</Label>
                        </Item>                  
                        
                        <Button full style={{ borderRadius: 5 }} onPress={this.handleRequestFix}><Text uppercase={false}>OK</Text></Button>
                        {/* <Item picker>
                            <Picker placeholderStyle={{ paddingLeft: 0 }}
                                placeholder="Chọn một lỗi có sẵn"
                                itemStyle={{ paddingLeft: 0 }}
                                itemTextStyle={{ paddingLeft: 0 }}
                                onValueChange={this.handleError}
                                selectedValue={error_code}
                                iosIcon={<Icon name="arrowright" type="AntDesign" />}>
                                {viewErrorList}
                            </Picker>
                        </Item>
                        <Label style={{ marginTop: 10, marginBottom: 10 }}>Chọn ngày hoàn thành</Label>
                        {
                            Platform.OS === "android" && <Button onPress={this.showDate} success><Icon name="calendar" /><Text>{date}</Text></Button>

                        }
                        {
                            Platform.OS === "ios" ? <DateTimePicker
                                testID="dateTimePicker"
                                value={new Date(date)}
                                mode={'date'}
                                is24Hour={true}
                                display="default"
                                accessibilityViewIsModal={false}
                                onChange={this.handleDateChange}

                            /> :
                                showDate && <DateTimePicker
                                    testID="dateTimePicker"
                                    value={new Date(date)}
                                    mode={'date'}
                                    is24Hour={true}
                                    display="default"
                                    accessibilityViewIsModal={false}
                                    onChange={this.handleDateChange}
                                    onTouchCancel={() => console.log(1)}
                                />
                        }
                        <Label style={{ marginTop: 10, marginBottom: 10 }}>Tải ảnh lên (03 ảnh)</Label>
                        <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 20 }}>
                            {images[0] === undefined ? <Button onPress={() => this.pickImage("0")} style={{ marginRight: 5 }} icon bordered>
                                <Icon name="image" type="FontAwesome" />
                            </Button> : <TouchableOpacity style={{ marginRight: 5 }} onPress={() => this.pickImage("0")}><Thumbnail square large source={{ uri: images[0].uri }} /></TouchableOpacity>}
                            {images[1] === undefined ? <Button onPress={() => this.pickImage("1")} style={{ marginRight: 5 }} icon bordered>
                                <Icon name="image" type="FontAwesome" />
                            </Button> : <TouchableOpacity style={{ marginRight: 5 }} onPress={() => this.pickImage("1")}><Thumbnail square large source={{ uri: images[1].uri }} /></TouchableOpacity>}
                            {images[2] === undefined ? <Button onPress={() => this.pickImage("2")} style={{ marginRight: 5 }} icon bordered>
                                <Icon name="image" type="FontAwesome" />
                            </Button> : <TouchableOpacity style={{ marginRight: 5 }} onPress={() => this.pickImage("2")}><Thumbnail square large source={{ uri: images[2].uri }} /></TouchableOpacity>}
                        </View>

                        <Button full style={{ borderRadius: 5 }} onPress={this.handleRequestFix}><Text uppercase={false}>Gởi yêu cầu</Text></Button> */}
                    </View>

                </Content>
                <Modal visible={scan}>
                    <ScanQR closeScreen={this.closeScreen} {...this.props} scanResult={(data) => this.scanResult(data)} />
                </Modal>
            </Container>
        );
    }
}

export default UserMayPhat;

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    container: {
        position: 'relative'
    },
    emptyStay: {
        textAlign: 'center',
    },
    countBadge: {
        paddingHorizontal: 8.6,
        paddingVertical: 5,
        borderRadius: 30,
        position: 'absolute',
        right: 3,
        bottom: 3,
        justifyContent: 'center',
        backgroundColor: '#0580FF',
        width: 30,
        height: 30
    },
    countBadgeText: {
        fontWeight: 'bold',
        alignSelf: 'center',
        padding: 'auto',
        color: '#ffffff'
    }
});