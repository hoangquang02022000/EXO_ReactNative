import { Button, Container, Content, Icon, Input, Item, Label, Picker, Text, Thumbnail } from 'native-base';
import React, { Component } from 'react';
import { Modal, View, StyleSheet, Alert, Platform, AsyncStorage } from 'react-native';
import Myheader from '../../components/Myheader';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CurrentTime, GetUserLocal, TimeToString } from '../../func';
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { UserRequestFix, UserRequestFix_Image } from '../../api/Order';
import ScanQR from './ScanQR';
import { isEmpty } from '../../components/Validate';
import Spinner from 'react-native-loading-spinner-overlay';
import { Path } from '../../api/Path';

class UserMaintenance extends Component {
    state = {
        showDate: false,
        showDateMaintenance: false,
        imgNumber: 0,
        submit: () => { },
        modal: false,
        images: [],
        errorList: [],
        listWater: [],
        listStatusWind: [],
        listStatusOil: [],
        listStatusBattery: [],
        listStatusScreen: [],
        listStatusSensor: [],

        name_Maintenance: null,
        status_water: null,
        status_wind: null,
        status_oil: null,
        status_battery: null,
        time_active_battery: null,
        status_screen: null,
        status_sensor: null,
        voltage: null,
        frequence: null,
        temperature: null,
        oil_pressure: null,

        scan: false,

        error_code: null,
        date: CurrentTime(),
        date_change_oil: CurrentTime(),
        userid: null,
        db_name: null,
        mc_code: "",
        mc_name: "",
        mc_detail: null,
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

    showDateMaintenance = () => {
        this.setState({ showDateMaintenance: true })
    }

    async componentDidMount() {
        let user = await GetUserLocal();
        let { mc_code, mc_name} = this.state;
        mc_code = await AsyncStorage.getItem("mc_code");
        mc_name = await AsyncStorage.getItem("mc_name");
        console.log("mc_code: ", mc_code);
        
        let { userid, images, error_code, date, db_name} = this.state;
        db_name = user.db_name;
        console.log("db_name: ", user.db_name)
        console.log("userid: ", user.userid)
        this.setState({db_name: db_name, userid: user.userid, mc_code: JSON.parse(mc_code), mc_name: JSON.parse(mc_name)});
        this.setState({ spinner: true });
        this.getMasterResult("nuoc lam mat", user.userid);
        this.getMasterResult("long quat", user.userid);
        this.getMasterResult("nhot", user.userid);
        this.getMasterResult("xac binh", user.userid);
        this.getMasterResult("man hinh", user.userid);
        this.getMasterResult("cam bien bao ve", user.userid);
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
            this.setState({ date: fixDate, showDate: false })
        } else {
            this.setState({ showDate: false })
        }

    }

    handleDateChange_Oil = (event, value) => {
        if (value !== undefined) {
            let fixDate = TimeToString(value);
            this.setState({ date_change_oil: fixDate, showDateMaintenance: false })
        } else {
            this.setState({ showDateMaintenance: false })
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
                case "3":
                    images[3] = obj;
                    break;
                case "4":
                    images[4] = obj;
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
    handleTimeActiveBattery = (time_active_battery) => {
        this.setState({ time_active_battery })
    }
    handleVoltage = (voltage) => {
        this.setState({ voltage })
    }
    handleFrequence = (frequence) => {
        this.setState({ frequence })
    }
    handleTemperature = (temperature) => {
        this.setState({ temperature })
    }
    handleOilPressure = (oil_pressure) => {
        this.setState({ oil_pressure })
    }

    handleMcdetail = (mc_detail) => {
        this.setState({ mc_detail })
    }

    handleRequestFix = () => {
        
        let { userid, images, error_code, date, mc_code, mc_name, mc_detail, db_name,
            date_change_oil, status_water, status_wind, status_oil,
            status_battery,
            time_active_battery,
            status_screen,
            status_sensor,
            voltage ,
            frequence,
            temperature,
            oil_pressure } = this.state;

        let checkMc_Code = isEmpty(mc_code, "thiết bị");
        if (!checkMc_Code) {
            return false;
        }
        

        if (images.length < 5) {
            Alert.alert("Thông báo", "Vui lòng chọn 5 ảnh");
            return false;
        }

        this.setState({ spinner: true });
        const formData = new FormData();
        images.forEach(item => {
            formData.append("files[]", item);
        })
        time_active_battery = time_active_battery.replace(',', '.');
        temperature = temperature.replace(',', '.');
        // const myStr = "8,5";
        // const newStr = myStr.replace(",", ".");
        
        let data = [
            db_name,
            mc_code,
            mc_name,
            date,
            status_water,
            status_wind,
            status_oil,
            status_battery,
            time_active_battery,
            status_screen,
            status_sensor,
            voltage,
            frequence,
            temperature,
            oil_pressure,
            "",
            "",
            "",
            "",
            "",
            date_change_oil,
            mc_detail,
            userid    
        ]
        console.log("data: ", data);
        let strUser = {
            "DataBaseName": Path.DataBaseName,
            "StoreProcedureName": "sp_INS_UP_MaintenanceMachine",
            "Params": data
        }
        console.log("strUser: ", strUser);

        UserRequestFix(strUser, res => {
            
            console.log("UserRequestFix: ", JSON.parse(res));
            JSON.parse(res).map((item, i) => {
                console.log("item: ", item.ERROR);
                if(item.ERROR > 0)
                {
                    UserRequestFix_Image(db_name, userid, formData, res => {
                        console.log("UserRequestFix_Image: ", res);
                        if(res === "5")
                        {
                            if(item.ERROR === 1)
                            {
                                Alert.alert("Thông báo! ", "Thành công!")
                            }
                            else
                            {
                                Alert.alert("Thông báo! ", "Cập nhật thành công!")
                            }
                            this.setState({
                            images: [],
                            mc_detail: null})

                        }
                        else
                        {
                            
                            Alert.alert("Thông báo! ", "Thất bại! Lỗi upload lên " + res + " ảnh")
                        }
                    })
                    

                }
                else
                {
                    
                    Alert.alert("Thông báo! ", "Thất bại! Lỗi " + JSON.parse(res))
                    //this.setState({ spinner: false });
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

    getMasterResult = (data, userid) => {
        
        
        this.setState({ spinner: true });  
        let fdata = [
            data,
            userid    
        ]
        console.log("data: ", fdata);
        let strUser = {
            "DataBaseName": Path.DataBaseName,
            "StoreProcedureName": "sp_GET_MASTER_SELECT",
            "Params": fdata
        }
        console.log("strUser: ", strUser);
        UserRequestFix(strUser, res => {
            console.log("UserRequestFix Main: ", JSON.parse(res));
            if(data === "nuoc lam mat")
            {
                this.setState({listWater: JSON.parse(res)})
            }
            else if(data === "long quat")
            {
                this.setState({listStatusWind: JSON.parse(res)})
            }
            else if(data === "nhot")
            {
                this.setState({listStatusOil: JSON.parse(res)})
            }
            else if(data === "xac binh")
            {
                this.setState({listStatusBattery: JSON.parse(res)})
            }
            else if(data === "man hinh")
            {
                this.setState({listStatusScreen: JSON.parse(res)})
            }
            else if(data === "cam bien bao ve")
            {
                this.setState({listStatusSensor: JSON.parse(res)})
                setTimeout(() => {
                    this.setState({ spinner: false })
                }, 3000);
            }
            // JSON.parse(res).map((item, i) => {
            //     this.setState({
            //         mc_name: item.NAME_MACHINE
            //         })
            //   })   
        })

        
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

    handleInput = (key, value) => {
        let obj = [];
        obj[key] = value;
        this.setState(obj);
    }

    render() {

        let { date, errorList, error_code, images, mc_code, mc_name, mc_detail, scan, showDate, listWater, name_Maintenance, 
             date_change_oil, status_water, status_wind, status_oil, showDateMaintenance,
             status_battery,
             time_active_battery,
             status_screen,
             status_sensor,
             voltage ,
             frequence,
             temperature,
             oil_pressure, 
             listStatusWind,
             listStatusOil,
             listStatusBattery,
             listStatusScreen,
             listStatusSensor,} = this.state;
        
        //listWater = [{"name_Maintenance": "abc"},{"name_Maintenance": "def"}]
        let viewWater = null;
        if(listWater.length > 0)
        {
            viewWater = listWater.map((item, i) => {
                return <Picker.Item key={i} value={item.VALUE_OPTION} label={item.VALUE_OPTION} />
            })
        }
        let viewStatusWind = null;
        if(listStatusWind.length > 0)
        {
            viewStatusWind = listStatusWind.map((item, i) => {
                return <Picker.Item key={i} value={item.VALUE_OPTION} label={item.VALUE_OPTION} />
            })
        }
        let viewStatusOil = null;
        if(listStatusOil.length > 0)
        {
            viewStatusOil = listStatusOil.map((item, i) => {
                return <Picker.Item key={i} value={item.VALUE_OPTION} label={item.VALUE_OPTION} />
            })
        }
        let viewStatusBattery = null;
        if(listStatusBattery.length > 0)
        {
            viewStatusBattery = listStatusBattery.map((item, i) => {
                return <Picker.Item key={i} value={item.VALUE_OPTION} label={item.VALUE_OPTION} />
            })
        }
        let viewStatusScreen = null;
        if(listStatusScreen.length > 0)
        {
            viewStatusScreen = listStatusScreen.map((item, i) => {
                return <Picker.Item key={i} value={item.VALUE_OPTION} label={item.VALUE_OPTION} />
            })
        }
        let viewStatusSensor = null;
        
        if(listStatusSensor.length > 0)
        {
            viewStatusSensor = listStatusSensor.map((item, i) => {
                return <Picker.Item key={i} value={item.VALUE_OPTION} label={item.VALUE_OPTION} />
            })
        }
        let viewErrorList = errorList.map((item, i) => {
            return <Picker.Item key={i} value={item.code} label={item.name_vn} />
        })
        return (
            <Container style={{ backgroundColor: "#f1f1f1" }}>
                <Myheader {...this.props} goBack={false} title="Bảo trì" />
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
                            <Input defaultValue={mc_code} placeholder="Nhập mã" onChangeText={this.handleMcCode} />
                            <Button onPress={this.showQRScan} transparent icon><Icon name="qrcode-scan" type="MaterialCommunityIcons" /></Button>
                        </Item>
                        <Label style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>Tên máy</Label>
                        <Item>
                            <Input defaultValue={mc_name} placeholder="Tên máy" onChangeText={this.handleMcName} autoCorrect={false} keyboardType="default" autoCapitalize="none" />
                        </Item>                        */}
                        <Label style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>Ngày bảo trì</Label>
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
                        <Label style={{ marginTop: 10, marginBottom: 5, fontWeight: 'bold' }}>TÌNH TRẠNG NƯỚC LÀM MÁT</Label>
                        <Item picker>
                            <Picker selectedValue={status_water} onValueChange={(value) => this.handleInput("status_water", value)} placeholder ="TÌNH TRẠNG NƯỚC LÀM MÁT"  iosIcon={<Icon name="arrow-down" />}>
                                {viewWater}
                            </Picker>
                        </Item> 
                        <Label style={{ marginTop: 10, marginBottom: 5, fontWeight: 'bold' }}>TÌNH TRẠNG LỒNG QUẠT</Label>
                        <Item picker>
                            <Picker selectedValue={status_wind} onValueChange={(value) => this.handleInput("status_wind", value)} placeholder="TÌNH TRẠNG LỒNG QUẠT" iosIcon={<Icon name="arrow-down" />}>
                                {viewStatusWind}
                            </Picker>
                        </Item>
                        <Label style={{ marginTop: 10, marginBottom: 5, fontWeight: 'bold' }}>TÌNH TRẠNG NHỚT</Label>
                        <Item picker>
                            <Picker selectedValue={status_oil} onValueChange={(value) => this.handleInput("status_oil", value)} placeholder="TÌNH TRẠNG NHỚT" iosIcon={<Icon name="arrow-down" />}>
                                {viewStatusOil}
                            </Picker>
                        </Item>
                        <Label style={{ marginTop: 10, marginBottom: 5, fontWeight: 'bold' }}>TÌNH TRẠNG SẠC BÌNH</Label>
                        <Item picker>
                            <Picker selectedValue={status_battery} onValueChange={(value) => this.handleInput("status_battery", value)} placeholder="TÌNH TRẠNG SẠC BÌNH" iosIcon={<Icon name="arrow-down" />}>
                                {viewStatusBattery}
                            </Picker>
                        </Item>
                        <Label style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>Thời gian hoạt động bình điện (tháng)</Label>
                        <Item>
                            <Input defaultValue={time_active_battery} placeholder="Thời gian hoạt động bình điện (tháng)" autoCorrect={false} keyboardType="numeric" onChangeText={this.handleTimeActiveBattery} />
                        </Item>
                        <Label style={{ marginTop: 10, marginBottom: 5, fontWeight: 'bold' }}>TÌNH TRẠNG MÀN HÌNH</Label>
                        <Item picker>
                            <Picker selectedValue={status_screen} onValueChange={(value) => this.handleInput("status_screen", value)} placeholder="TÌNH TRẠNG MÀN HÌNH" iosIcon={<Icon name="arrow-down" />}>
                                {viewStatusScreen}
                            </Picker>
                        </Item>
                        <Label style={{ marginTop: 10, marginBottom: 5, fontWeight: 'bold' }}>TÌNH TRẠNG CẢM BIẾN BẢO VỆ</Label>
                        <Item picker>
                            <Picker selectedValue={status_sensor} onValueChange={(value) => this.handleInput("status_sensor", value)} placeholder="TÌNH TRẠNG CẢM BIẾN BẢO VỆ" iosIcon={<Icon name="arrow-down" />}>
                                {viewStatusSensor}
                            </Picker>
                        </Item>
                        <Label style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>Điện áp (Voll)</Label>
                        <Item>
                            <Input defaultValue={voltage} placeholder="Điện áp" autoCorrect={false} keyboardType="phone-pad" onChangeText={this.handleVoltage} />
                        </Item>
                        <Label style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>Tần số (Hz)</Label>
                        <Item>
                            <Input defaultValue={frequence} placeholder="Tần số" autoCorrect={false} keyboardType="phone-pad" onChangeText={this.handleFrequence} />
                        </Item>
                        <Label style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>Nhiệt độ (°C)</Label>
                        <Item>
                            <Input defaultValue={temperature} placeholder="Nhiệt độ" autoCorrect={false} keyboardType="numeric" onChangeText={this.handleTemperature} />
                        </Item>
                        <Label style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>Áp suất nhớt (kg/cm)</Label>
                        <Item>
                            <Input defaultValue={oil_pressure} placeholder="Áp suất nhớt" autoCorrect={false} keyboardType="default" onChangeText={this.handleOilPressure} />
                        </Item>
                        <Label style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>Ngày tháng thay nhớt</Label>
                        {
                            Platform.OS === "android" && <Button onPress={this.showDateMaintenance} success><Icon name="calendar" /><Text>{date_change_oil}</Text></Button>

                        }
                        {
                            Platform.OS === "ios" ? <DateTimePicker
                                testID="dateTimePicker"
                                value={new Date(date_change_oil)}
                                mode={'date'}
                                is24Hour={true}
                                display="default"
                                accessibilityViewIsModal={false}
                                onChange={this.handleDateChange_Oil}

                            /> :
                            showDateMaintenance && <DateTimePicker
                                    testID="dateTimePicker"
                                    value={new Date(date_change_oil)}
                                    mode={'date'}
                                    is24Hour={true}
                                    display="default"
                                    accessibilityViewIsModal={false}
                                    onChange={this.handleDateChange_Oil}
                                    onTouchCancel={() => console.log(1)}
                                />
                        }
                        <Label style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>Tải ảnh lên (05 ảnh)</Label>
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
                            {images[3] === undefined ? <Button onPress={() => this.pickImage("3")} style={{ marginRight: 5 }} icon bordered>
                                <Icon name="image" type="FontAwesome" />
                            </Button> : <TouchableOpacity style={{ marginRight: 5 }} onPress={() => this.pickImage("3")}><Thumbnail square large source={{ uri: images[3].uri }} /></TouchableOpacity>}
                            {images[4] === undefined ? <Button onPress={() => this.pickImage("4")} style={{ marginRight: 5 }} icon bordered>
                                <Icon name="image" type="FontAwesome" />
                            </Button> : <TouchableOpacity style={{ marginRight: 5 }} onPress={() => this.pickImage("4")}><Thumbnail square large source={{ uri: images[4].uri }} /></TouchableOpacity>}
                            
                        </View>
                        <Label style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>Thông tin bảo trì (tối đa 300 ký tự)</Label>                       
                        <Item style={{ paddingBottom: 25 }}>
                            <Input defaultValue={mc_detail} placeholder="Thông tin bảo trì (tối đa 300 ký tự)" onChangeText={this.handleMcdetail} autoCorrect={false} keyboardType="default" autoCapitalize="none" maxLength={300}/>
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

export default UserMaintenance;

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