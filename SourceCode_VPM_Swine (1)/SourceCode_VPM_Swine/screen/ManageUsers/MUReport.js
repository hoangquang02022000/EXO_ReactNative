//UserReport.js
import { Button, Container, Content, Icon, Input, Item, Label, Picker, Text } from 'native-base';
import React, { Component } from 'react';
import { Modal, View, StyleSheet, Alert } from 'react-native';
import Myheader from '../../components/Myheader';
import { getErrorList } from '../../api/Device';
import { CurrentTime, GetUserLocal, TimeToString, VpmPushNotification } from '../../func';
import * as ImagePicker from 'expo-image-picker';
import { UserRequestFix } from '../../api/Order';
//import ScanQR from './ScanQR';
import { isEmpty } from '../../components/Validate';
import Spinner from 'react-native-loading-spinner-overlay';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Path } from '../../api/Path';

class MUReport extends Component {
    state = {
        showDate: false,
        imgNumber: 0,
        submit: () => { },
        modal: false,
        images: [],
        errorList: [],
        listOrgCode: [],
        org_code: null,
        listReport: [],
        typeReport: null,
        scan: false,

        error_code: null,
        date: CurrentTime(),
        date_end: CurrentTime(),
        userid: null,
        db_name: null,
        mc_code: null,
        spinner: false,
        Email: "",
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
        this.setState({ spinner: true });
        this.setState({ userid: user.userid, db_name: user.db_name })
        getErrorList(user.db_name, res => {
            this.setState({ errorList: res })
        })
        this.getMasterResult("bao cao", user.userid);
        let org = await AsyncStorage.getItem("listBA");  
        //console.log("listorg: ", org);
        let org_code = [];
        org_code.push({"ba_code":"all","ba_name":"Tất cả","db_name":"all"});
        JSON.parse(org).map((item, i) => {
            org_code.push({"ba_code":item.ba_code,"ba_name":item.ba_name,"db_name":item.db_name});
        })
        //org_code.push(JSON.parse(org));
        //console.log("org_code: ", org_code);
        this.setState({ listOrgCode: org_code });  
        
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
            if(JSON.parse(res) !== null)
            {
                this.setState({listReport: JSON.parse(res)})
            } 
            this.setState({ spinner: false });
        })

        
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
    handleDateEndChange = (event, value) => {
        
        if (value !== undefined) {
            let fixDate = TimeToString(value);
            this.setState({ date_end: fixDate, showDate: false })
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

    handleRequestFix = () => {

        let { userid, images, error_code, date, mc_code, db_name, Email, org_code } = this.state;

        let checkMc_Code = isEmpty(Email, "Username");
        if (!checkMc_Code) {
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
        let fdata = [
            org_code,
            Email,
            userid    
        ]
        console.log("data: ", fdata);
        let strUser = {
            "DataBaseName": Path.DataBaseName,
            "StoreProcedureName": "sp_INS_UP_MAPPING",
            "Params": fdata
        }
        console.log("strUser: ", strUser);
        UserRequestFix(strUser, res => {
            console.log("UserRequestFix: ", JSON.parse(res));
            JSON.parse(res).map((item, i) => {
                if (item.ERROR === 1) {
                    
                    Alert.alert("Thông báo", "Thành công!");
                } 
                else if (item.ERROR === 2) {
                    //this.setState({ spinner: false });
                    Alert.alert("Thông báo", "Đã tồn tại!");
                }
                else 
                {
                    //this.setState({ spinner: false });
                    Alert.alert("Thông báo",  "Thất bại!")
                }
              }) 
            
            
        })
        this.setState({ spinner: false });
        // setTimeout(() => {
        //     this.setState({ spinner: false })
        // }, 3000);
    }
    showQRScan = () => {
        this.setState({ scan: true })
    }

    closeScreen = () => {
        this.setState({ scan: false })
    }

    scanResult = (data) => {
        this.setState({ scan: false, mc_code: data })
    }

    handleInput = (key, value) => {
        let obj = [];
        obj[key] = value;
        this.setState(obj);
    }

    render() {

        let { date, date_end, errorList, error_code, images, mc_code, scan, showDate, listOrgCode, org_code, listReport, typeReport } = this.state;
        let viewOrg = null;
        let viewReport = null;
        //console.log("listOrg render: ", listOrgCode);
        
        // listOrg = [
        //     {
        //       "ba_code": "00E020",
        //       "ba_name": "phú giáo 2",
        //       "db_name": "00E020"
        //     },
        //     {
        //       "ba_code": "00E042",
        //       "ba_name": "cẫm mỹ 2",
        //       "db_name": "00E042"
        //     },
        //     {
        //       "ba_code": "005E158",
        //       "ba_name": "tân hòa 1",
        //       "db_name": "005E158"
        //     }]
        if(listOrgCode.length > 0)
        {
            viewOrg = listOrgCode.map((item, i) => {
                if(i === 0)
                {

                }
                else
                {

                }
                return <Picker.Item key={i} value={item.ba_code} label={item.ba_name} />
            })
        }
        if(listReport.length > 0)
        {
            viewReport = listReport.map((item, i) => {
                return <Picker.Item key={i} value={item.VALUE_OPTION} label={item.VALUE_OPTION} />
            })
        }
        let viewErrorList = errorList.map((item, i) => {
            return <Picker.Item key={i} value={item.code} label={item.name_vn} />
        })
        return (
            <Container style={{ backgroundColor: "#f1f1f1" }}>
                <Myheader {...this.props} goBack={false} title="Mapping User" />
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
                        {/* <Item>
                            <Input defaultValue={mc_code} placeholder="Nhập mã" onChangeText={this.handleMcCode} />
                            <Button onPress={this.showQRScan} transparent icon><Icon name="qrcode-scan" type="MaterialCommunityIcons" /></Button>
                        </Item>
                        <Item>
                            <Input defaultValue={0} placeholder="Tên máy" onChangeText={this.handleMcCode} autoCorrect={false} keyboardType="word" autoCapitalize="none" />
                        </Item> */}
                        <Item picker>
                            <Picker selectedValue={org_code} onValueChange={(value) => this.handleInput("org_code", value)} placeholder="Chọn trại" iosIcon={<Icon name="arrow-down" />}>
                                {viewOrg}
                            </Picker>
                        </Item>
                        <Item style={{}}>
                            <Input autoCorrect={false} onChangeText={(value) => this.handleInput("Email", value)} placeholder="Username" keyboardType="email" autoCapitalize="none" />
                        </Item>
                        
                        
                        
                        {/* <Label style={{ marginTop: 40, marginBottom: 40, fontWeight: 'bold'}}>Thông tin</Label>
                        <Label style={{ marginTop: 10, marginBottom: 40, fontWeight: 'bold'}}>Lịch sử chạy máy</Label>
                        <Label style={{ marginTop: 10, marginBottom: 40, fontWeight: 'bold'}}>Bảo trì</Label>
                        <Label style={{ marginTop: 10, marginBottom: 40, fontWeight: 'bold'}}>Lịch sử hư hỏng</Label> */}
                        
                        {/* {
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
                        
                        <Item>
                            <Input defaultValue={0} placeholder="Tình trạng hư hỏng (tối đa 300 ký tự)" maxLength={300} onChangeText={this.handleMcCode} autoCorrect={false} keyboardType="word" autoCapitalize="none"/>
                        </Item>
                        <Item style={{ paddingBottom: 25 }}>
                            <Input defaultValue={0} placeholder="Chi phí (VNĐ)" onChangeText={this.handleMcCode} autoCorrect={false} keyboardType="phone-pad" autoCapitalize="none"/>
                        </Item>                         */}
                                              
                        
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
                        <Button full style={{ borderRadius: 5,marginTop: 30 }} onPress={this.handleRequestFix}><Text uppercase={false}>OK</Text></Button>
                    </View>

                </Content>
                {/* <Modal visible={scan}>
                    <ScanQR closeScreen={this.closeScreen} {...this.props} scanResult={(data) => this.scanResult(data)} />
                </Modal> */}
            </Container>
        );
    }
}

export default MUReport;

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