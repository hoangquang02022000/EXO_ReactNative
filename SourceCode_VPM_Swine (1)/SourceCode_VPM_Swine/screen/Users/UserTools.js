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
import { isEmptyTools } from '../../components/Validate';
import Spinner from 'react-native-loading-spinner-overlay';
import { Path } from '../../api/Path';

class UserTools extends Component {
    state = {
        showDate: false,
        imgNumber: 0,
        submit: () => { },
        modal: false,
        images: [],
        errorList: [],
        listMaterialReplace: [],
        listType: [],
        scan: false,

        error_code: null,
        date: CurrentTime(),
        userid: null,
        db_name: null,
        mc_code: "",
        mc_name: "",
        mc_detail: "",
        mc_cost: 0,
        TROUBLESHOOTING_TIME: null,
        MATERIAL_REPLACE: "",
        MATERIAL_REPLACE_Other: "",
        TYPE: null,
        ERROR_NOT_FIX: "",

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
        let { mc_code, mc_name} = this.state;
        mc_code = await AsyncStorage.getItem("mc_code");
        mc_name = await AsyncStorage.getItem("mc_name");
        console.log("mc_code: ", mc_code);
        this.setState({ userid: user.userid, db_name: user.db_name, mc_code: JSON.parse(mc_code), mc_name: JSON.parse(mc_name) })
        
        this.getMasterResult("hinh thuc", user.userid);
        this.getMasterResult("vat tu thay the", user.userid);
        getErrorList(user.db_name, res => {
            if(res !== null)
            {
                this.setState({ errorList: res })
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
    handleMcdetail = (mc_detail) => {
        this.setState({ mc_detail })
    }
    handleMccost = (mc_cost) => {
        this.setState({ mc_cost })
    }
    handleTROUBLESHOOTING_TIME = (TROUBLESHOOTING_TIME) => {
        this.setState({ TROUBLESHOOTING_TIME })
    }

    handleMATERIAL_REPLACE = (MATERIAL_REPLACE) => {
        this.setState({ MATERIAL_REPLACE })
    }

    handleMATERIAL_REPLACE_Other = (MATERIAL_REPLACE_Other) => {
        this.setState({ MATERIAL_REPLACE_Other })
    }

    handleERROR_NOT_FIX = (ERROR_NOT_FIX) => {
        this.setState({ ERROR_NOT_FIX })
    }

    handleRequestFix = () => {

        let { userid, images, error_code, date, mc_code, mc_name, mc_detail, mc_cost, db_name,
            TROUBLESHOOTING_TIME,
            MATERIAL_REPLACE,
            MATERIAL_REPLACE_Other,
            TYPE,
            ERROR_NOT_FIX,
        
        } = this.state;

        let checkmc_detail = isEmptyTools(mc_detail, "'Tình trạng hư hỏng???'");
        if (!checkmc_detail) {
            return false;
        }

        let checkMc_Code = isEmptyTools(mc_code, "thiết bị");
        if (!checkMc_Code) {
            return false;
        }

        let checkMc_Name = isEmptyTools(mc_name, "tên thiết bị");
        if (!checkMc_Name) {
            return false;
        }
        
        let checkMATERIAL_REPLACE = true;
        if(MATERIAL_REPLACE === "Khác")
        {
            checkMATERIAL_REPLACE = isEmptyTools(MATERIAL_REPLACE_Other, "vật tư thay thế khác ???");
            if (!checkMATERIAL_REPLACE ) {
                return false;
            }
            else
            {
                MATERIAL_REPLACE += ": " + MATERIAL_REPLACE_Other;
            }
        }
        
        if(TROUBLESHOOTING_TIME !== null && parseFloat(TROUBLESHOOTING_TIME.replace(',','.')) > 0 
        && checkMc_Code && checkMc_Name && checkMATERIAL_REPLACE && checkmc_detail)
        {
            this.setState({ spinner: true });
            TROUBLESHOOTING_TIME = TROUBLESHOOTING_TIME.replace(',','.');
            
            let data = [
                db_name,
                mc_code,
                mc_name,
                date,            
                mc_detail,
                mc_cost,
                TROUBLESHOOTING_TIME,
                MATERIAL_REPLACE,
                TYPE,
                ERROR_NOT_FIX,
                userid    
            ]
            console.log("data: ", data);
            let strUser = {
                "DataBaseName": Path.DataBaseName,
                "StoreProcedureName": "sp_INS_UP_BrokenMachine",
                "Params": data
            }
            console.log("strUser: ", strUser);

            UserRequestFix(strUser, res => {
                console.log("UserRequestFix: ", JSON.parse(res));
                JSON.parse(res).map((item, i) => {
                    console.log("item: ", item.ERROR);
                    if(item.ERROR > 0)
                    {
                        Alert.alert("Thông báo! ", "Thành công!")
                        this.setState({
                            images: [],
                            mc_detail: null,
                            mc_cost: 0,
                            TROUBLESHOOTING_TIME: null,
                            MATERIAL_REPLACE: null,
                            TYPE: null,
                            ERROR_NOT_FIX: null,
                        
                        })
                    }
                    else
                    {
                        Alert.alert("Thông báo! ", "Thất bại! Lỗi " + JSON.parse(res))
                    }
                    
                })
            })
        }
        else
        {
            Alert.alert("Thông báo! ", "Vui lòng kiểm tra lại 'Thời gian xử lý sự cố' và 'Vật tư thay thế ???'");
        }
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
            if(JSON.parse(res) !== null)
            {
                if(data === "hinh thuc")
                {
                    this.setState({listType: JSON.parse(res)})
                }
                else
                {
                    this.setState({listMaterialReplace: JSON.parse(res)})
                }
            }
        })
        setTimeout(() => {
            this.setState({ spinner: false })
        }, 3000);
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

        let { date, errorList, error_code, images, mc_code, mc_name, mc_detail, mc_cost, scan, showDate, listType, listMaterialReplace,
            TROUBLESHOOTING_TIME,
            MATERIAL_REPLACE,
            MATERIAL_REPLACE_Other,
            TYPE,
            ERROR_NOT_FIX,
            } = this.state;
        let viewType = null;
        let viewMaterialReplace = null;
        if(listType.length > 0)
        {
            viewType = listType.map((item, i) => {
                return <Picker.Item key={i} value={item.VALUE_OPTION} label={item.VALUE_OPTION} />
            })
        }
        if(listMaterialReplace.length > 0)
        {
            viewMaterialReplace = listMaterialReplace.map((item, i) => {
                return <Picker.Item key={i} value={item.VALUE_OPTION} label={item.VALUE_OPTION} />
            })
        }
        let viewErrorList = errorList.map((item, i) => {
            return <Picker.Item key={i} value={item.code} label={item.name_vn} />
        })
        return (
            <Container style={{ backgroundColor: "#f1f1f1" }}>
                <Myheader {...this.props} goBack={false} title="Lịch sử hư hỏng" />
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
                        </Item> */}
                        <Label style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>Ngày hỏng</Label>
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
                        <Label style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>Tình trạng hư hỏng</Label>
                        <Item style={{marginTop:20 }}>
                            <Input defaultValue={mc_detail} placeholder="Tình trạng hư hỏng (tối đa 300 ký tự)" maxLength={300} onChangeText={this.handleMcdetail} autoCorrect={false} keyboardType="default" autoCapitalize="none"/>
                        </Item>
                        <Label style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>Chi phí (VNĐ)</Label>
                        <Item style={{marginTop:10 }}>
                            <Input defaultValue={mc_cost} placeholder="Chi phí (VNĐ)" onChangeText={this.handleMccost} autoCorrect={false} keyboardType="phone-pad" autoCapitalize="none"/>
                        </Item> 
                        <Label style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>Thời gian xử lý sự cố (ngày)</Label>                       
                        <Item style={{marginTop:20 }}>
                            <Input defaultValue={TROUBLESHOOTING_TIME} value={TROUBLESHOOTING_TIME} placeholder="Thời gian xử lý sự cố (ngày)" onChangeText={this.handleTROUBLESHOOTING_TIME} autoCorrect={false} keyboardType="numeric" autoCapitalize="none"/>
                        </Item > 
                        {/* <Label style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>Vật tư thay thế</Label>                      
                        <Item style={{marginTop:20 }}>
                            <Input value={MATERIAL_REPLACE} placeholder="Vật tư thay thế (tối đa 300 ký tự)" maxLength={300} onChangeText={this.handleMATERIAL_REPLACE} autoCorrect={false} keyboardType="word" autoCapitalize="none"/>
                        </Item> */}
                        <Label style={{ marginTop: 20, marginBottom: 5, fontWeight: 'bold' }}>VẬT TƯ THAY THẾ</Label>
                        {MATERIAL_REPLACE === "Khác"?
                        <View>
                            <Item picker style={{marginTop:10 }}>
                                <Picker selectedValue={MATERIAL_REPLACE} onValueChange={(value) => this.handleInput("MATERIAL_REPLACE", value)} placeholder="Vật tư thay thế" iosIcon={<Icon name="arrow-down" />}>
                                    {viewMaterialReplace}
                                </Picker>
                            </Item>
                            <Item>
                                <Input value={MATERIAL_REPLACE_Other} placeholder="Vật tư thay thế (tối đa 300 ký tự)" maxLength={295} onChangeText={this.handleMATERIAL_REPLACE_Other} autoCorrect={false} keyboardType="word" autoCapitalize="none"/>
                            </Item>
                        </View>
                        : 
                        <Item picker style={{marginTop:10 }}>
                            <Picker selectedValue={MATERIAL_REPLACE} onValueChange={(value) => this.handleInput("MATERIAL_REPLACE", value)} placeholder="Vật tư thay thế" iosIcon={<Icon name="arrow-down" />}>
                                {viewMaterialReplace}
                            </Picker>
                        </Item>
                        }
                        <Label style={{ marginTop: 20, marginBottom: 5, fontWeight: 'bold' }}>HÌNH THỨC SỬA CHỮA</Label>
                        <Item picker style={{marginTop:10 }}>
                            <Picker selectedValue={TYPE} onValueChange={(value) => this.handleInput("TYPE", value)} placeholder="Hình thức sửa chữa" iosIcon={<Icon name="arrow-down" />}>
                                {viewType}
                            </Picker>
                        </Item> 
                        <Label style={{ marginTop: 20, marginBottom: 5, fontWeight: 'bold' }}>Tồn động cần khắc phục</Label>
                        <Item style={{marginTop:20 }}>
                            <Input value={ERROR_NOT_FIX} placeholder="Tồn động cần khắc phục (tối đa 300 ký tự)" maxLength={300} onChangeText={this.handleERROR_NOT_FIX} autoCorrect={false} keyboardType="default" autoCapitalize="none"/>
                        </Item>

                        <Button full style={{ borderRadius: 5, marginTop:30 }} onPress={this.handleRequestFix}><Text uppercase={false}>OK</Text></Button>
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

export default UserTools;

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