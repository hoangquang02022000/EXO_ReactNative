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
import { isEmpty } from '../../components/Validate';
import Spinner from 'react-native-loading-spinner-overlay';
import { Path } from '../../api/Path';


class UserOrder extends Component {
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
        mc_WATTAGE: "",
        mc_CONSUME:  "",
        mc_STANDARD_OIL:  0,
        mc_date: null,
        mc_year:  "",
        mc_hours:  "0",
        mc_time_broken:  "",
        mc_detail:  "",
        spinner: false
    }

    handleModal = () => {
        this.setState({ modal: !this.state.modal })
    }

    handleError = (error) => {
        this.setState({ error_code: error })
    }

    showDate = () => {

        //this.setState({ showDate: true })
        //console.log("showDate: ", showDate);
    }
    async componentWillReceiveProps() {
        console.log("ReceiveProps User ORDER: ");
        let user = await GetUserLocal();

        this.setState({ userid: user.userid, db_name: user.db_name })
        getErrorList(user.db_name, res => {
            this.setState({ errorList: res })
        })
        this.scanResult("");
    }
    async componentDidMount() {
        
            console.log("focus: ");
            let user = await GetUserLocal();

            this.setState({ userid: user.userid, db_name: user.db_name })
            getErrorList(user.db_name, res => {
                this.setState({ errorList: res })
            })
            this.scanResult("");    
        
    }

    getTOTAL_HOURS = (data) => {
        this.setState({ scan: false, mc_code: data })
        let { userid, mc_code, db_name, mc_hours} = this.state;
        this.setState({ spinner: true });  
        let fdata = [
            db_name,
            data,
            userid    
        ]
        console.log("data: ", fdata);
        let strUser = {
            "DataBaseName": Path.DataBaseName,
            "StoreProcedureName": "sp_GET_InfoMachine_Total_Hours",
            "Params": fdata
        }
        console.log("strUser: ", strUser);
        UserRequestFix(strUser, res => {
            console.log("UserRequestFix: ", JSON.parse(res));
            JSON.parse(res).map((item, i) => {
                this.setState({mc_hours: (item.TOTAL_HOURS)})
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
        console.log("handleDateChange: ", value);
        if (value !== undefined) {
            let fixDate = TimeToString(value);
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
    handleMcWATTAGE = (mc_WATTAGE) => {
        this.setState({ mc_WATTAGE })
    }
    handleMcCONSUME = (mc_CONSUME) => {
        this.setState({ mc_CONSUME })
    }
    handleMcSTANDARD_OIL = (mc_STANDARD_OIL) => {
        this.setState({ mc_STANDARD_OIL })
    }
    handleMcdate = (mc_date) => {
        this.setState({ mc_date })
    }
    handleMcyear = (mc_year) => {
        this.setState({ mc_year })
    }
    handleMchours = (mc_hours) => {
        this.setState({ mc_hours })
    }
    handleMctime_broken = (mc_time_broken) => {
        this.setState({ mc_time_broken })
    }
    handleMcdetail = (mc_detail) => {
        this.setState({ mc_detail })
    }
    
    handleRequestFix = () => {
        // mc_code: null,
        // mc_name: null,
        // mc_WATTAGE: null,
        // mc_CONSUME: null,
        // mc_STANDARD_OIL: null,
        // mc_date: null,
        // mc_year: null,
        // mc_hours: null,
        // mc_time_broken: null,
        // mc_detail: null,
        let { userid, images, error_code, date, mc_code, db_name, mc_name, mc_WATTAGE, mc_CONSUME
        , mc_STANDARD_OIL, mc_date, mc_year, mc_hours, mc_time_broken, mc_detail, showDate  } = this.state;

        let checkMc_Code = isEmpty(mc_code, "thiết bị");
        console.log(checkMc_Code);
        if (!checkMc_Code || mc_name === null || mc_name === "" || mc_WATTAGE === null || mc_WATTAGE === ""
        || mc_CONSUME === null || mc_CONSUME === "" || mc_STANDARD_OIL === null || mc_STANDARD_OIL === ""
        || mc_year === null || mc_year === "" || mc_hours === null || mc_hours === ""
        || mc_time_broken === null || mc_time_broken === "") {
            Alert.alert("Thông báo", "Vui lòng không bỏ trống!")
            return false;
        }
        // let checkEr_code = isEmpty(error_code, "lỗi thiết bị");
        // if (!checkEr_code) {
        //     return false;
        // }

        // if (images.length < 3) {
        //     Alert.alert("Thông báo", "Vui lòng chọn 3 ảnh");
        //     return false;
        // }

        this.setState({ spinner: true });
        // const formData = new FormData();
        // images.forEach(item => {
        //     formData.append("files[]", item);
        // })

        // let { userid, images, error_code, date, mc_code, db_name, mc_name, mc_WATTAGE, mc_CONSUME
        //     , mc_STANDARD_OIL, mc_date, mc_year, mc_hours, mc_time_broken, mc_detail  } = this.state;
        let data = [
            db_name,
            mc_code,
            mc_name,
            mc_WATTAGE,
            mc_CONSUME,
            mc_STANDARD_OIL,
            date,
            mc_year,
            mc_hours,
            mc_time_broken,
            mc_detail,
            userid    
        ]
        console.log("data: ", data);
        let strUser = {
            "DataBaseName": Path.DataBaseName,
            "StoreProcedureName": "sp_INS_UP_InfoMachine",
            "Params": data
        }
        console.log("strUser: ", strUser);
        UserRequestFix(strUser, res => {
            console.log("UserRequestFix: ", JSON.parse(res));
            JSON.parse(res).map((item, i) => {
                console.log("item: ", item.ERROR);
                if(item.ERROR === 1)
                {
                    Alert.alert("Thông báo! ", "Thêm thành công!")
                    this.setState({mc_code: null,
                        mc_name: null,
                        mc_WATTAGE: "",
                        mc_CONSUME: "",
                        mc_STANDARD_OIL: "",
                        
                        mc_year: "",
                        mc_hours: "",
                        mc_time_broken: "",
                        mc_detail: null})
                    //this.setState({dataArr: JSON.parse(res.data)});
                }
                else if(item.ERROR === 2)
                {
                    Alert.alert("Thông báo! ", "Cập nhật thành công!")
                    this.setState({mc_code: null,
                        mc_name: null,
                        mc_WATTAGE: "",
                        mc_CONSUME: "",
                        mc_STANDARD_OIL: "",
                        
                        mc_year: "",
                        mc_hours: "",
                        mc_time_broken: "",
                        mc_detail: null})
                    //this.setState({dataArr: JSON.parse(res.data)});
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
    //sp_GET_InfoMachine
    handleGetDataMachine = () => {
        
    }
    showQRScan = () => {
        this.setState({ scan: true })
    }

    closeScreen = () => {
        this.setState({ scan: false })
    }

    scanResult = async (data) => {
        this.setState({ scan: false, mc_code: data })
        let { userid, images, error_code, date, mc_code, db_name, mc_name, mc_WATTAGE, mc_CONSUME
            , mc_STANDARD_OIL, mc_date, mc_year, mc_hours, mc_time_broken, mc_detail, showDate  } = this.state;
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
        UserRequestFix(strUser, async res => {
            console.log("UserRequestFix: ", JSON.parse(res));
            let datares = JSON.parse(res);
            console.log("datares.QR_MACHINE: ", datares[0].QR_MACHINE);
            await AsyncStorage.setItem("mc_code", JSON.stringify(datares[0].QR_MACHINE)); 
            await AsyncStorage.setItem("mc_name", JSON.stringify(datares[0].NAME_MACHINE)); 
            await AsyncStorage.setItem("mc_CONSUME", JSON.stringify(datares[0].CONSUME)); 
            JSON.parse(res).map((item, i) => {
                
                this.getTOTAL_HOURS(item.QR_MACHINE);
                this.setState({
                    mc_code: item.QR_MACHINE,
                    mc_name: item.NAME_MACHINE,
                    mc_WATTAGE: item.WATTAGE,
                    mc_CONSUME: (item.CONSUME),
                    mc_STANDARD_OIL: (item.STANDARD_OIL),
                    date: TimeToString(item.EFFECT_DATE),
                    mc_year: (item.EFFECT_MONTH),
                    //mc_hours: (item.TOTAL_HOURS),
                    mc_time_broken: (item.TIME_BROKEN),
                    mc_detail: item.DETAIL})
                 
                
              })
            // console.log("mc_WATTAGE: ", this.state.mc_WATTAGE);
            
        })

        setTimeout(() => {
            this.setState({ spinner: false })
        }, 3000);
    }
    
    render() {

        let { date, errorList, error_code, images, mc_code, scan, mc_name, mc_date,
            mc_WATTAGE,
            mc_CONSUME,
            mc_STANDARD_OIL,
            showDate,
            mc_year,
            mc_hours,
            mc_time_broken,
            mc_detail } = this.state;
        let formatday = new Date(date);
        let month = "";
        if((formatday.getMonth() + 1) < 10)
        {
            month = "0" + (formatday.getMonth() + 1).toString();
        }
        else
        {
            month = (formatday.getMonth() + 1).toString();
        }
        let formattedDate = formatday.getDate()  + "/" + month + "/" + formatday.getFullYear()
        let viewErrorList = errorList.map((item, i) => {
            return <Picker.Item key={i} value={item.code} label={item.name_vn} />
        })
        return (
            <Container style={{ backgroundColor: "#f1f1f1" }}>
                <Myheader {...this.props} goBack={false} title="Thông tin máy" />
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
                        <Label style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>Mã máy</Label>
                        <Item>
                            <Input defaultValue={mc_code}  placeholder="Nhập mã" onChangeText={this.handleMcCode} editable={false} />
                            <Button onPress={this.showQRScan} transparent icon><Icon name="qrcode-scan" type="MaterialCommunityIcons" /></Button>
                        </Item>
                        <Label style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>Tên máy</Label>
                        <Item>
                            <Input defaultValue={mc_name} editable={false} placeholder="Tên máy" onChangeText={this.handleMcName} autoCorrect={false} keyboardType="default" autoCapitalize="none" />
                        </Item>
                        <Label style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>Công suất (kva)</Label>
                        <Item>
                            <Input value={mc_WATTAGE.toString()} editable={false} placeholder="Công suất (kva)" onChangeText={this.handleMcWATTAGE} autoCorrect={false} keyboardType="phone-pad" autoCapitalize="none" />
                        </Item>
                        <Label style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>Sử dụng nhiên liệu (l/h)</Label>
                        <Item>
                            <Input value={mc_CONSUME.toString()} editable={false} placeholder="Sử dụng nhiên liệu (l/h)" onChangeText={this.handleMcCONSUME} autoCorrect={false} keyboardType="phone-pad" autoCapitalize="none"/>
                        </Item>
                        <Label style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>Định mức nhớt (l)</Label>
                        <Item>
                            <Input value={mc_STANDARD_OIL.toString()} editable={false} placeholder="Định mức nhớt (l)" onChangeText={this.handleMcSTANDARD_OIL} autoCorrect={false} keyboardType="phone-pad" autoCapitalize="none"/>
                        </Item>                        
                        <Label style={{ marginTop: 10, marginBottom: 15, fontWeight: 'bold' }}>Ngày lắp đặt</Label>
                        {
                            Platform.OS === "android" && <Button success><Icon name="calendar" /><Text>{formattedDate}</Text></Button>

                        }
                        {
                            Platform.OS === "ios" ? <Button success><Icon name="calendar" /><Text>{formattedDate}</Text></Button> :
                                null
                        }
                        <Label style={{ marginTop: 20, marginBottom: 10, fontWeight: 'bold' }}>Số tháng HĐ</Label>                        
                        <Item>
                            <Input value={mc_year.toString()} editable={false} placeholder="Số tháng HĐ" onChangeText={this.handleMcyear} autoCorrect={false} keyboardType="numeric" autoCapitalize="none"/>
                        </Item>
                        <Label style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>Số giờ HĐ</Label>
                        <Item>
                            <Input value={mc_hours.toString()} editable={false} placeholder="Số giờ HĐ" onChangeText={this.handleMchours} autoCorrect={false} keyboardType="phone-pad" autoCapitalize="none"/>
                        </Item>
                        <Label style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>Số lần hư hỏng</Label>
                        <Item>
                            <Input value={mc_time_broken.toString()} editable={false} placeholder="Số lần hư hỏng" onChangeText={this.handleMctime_broken} autoCorrect={false} keyboardType="phone-pad" autoCapitalize="none"/>
                        </Item>
                        <Label style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>Liệt kê chi tiết (tối đa 300 ký tự)</Label>
                        <Item style={{ paddingBottom: 25 }}>
                            <Input value={mc_detail} editable={false} placeholder="Liệt kê chi tiết (tối đa 300 ký tự)" onChangeText={this.handleMcdetail} maxLength={300}/>
                        </Item>
                        {/* <Button full style={{ borderRadius: 5 }} onPress={this.handleRequestFix}><Text uppercase={false}>OK</Text></Button> */}
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

export default UserOrder;

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