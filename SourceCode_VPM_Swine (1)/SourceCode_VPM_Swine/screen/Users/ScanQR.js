import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, AsyncStorage } from 'react-native';
import * as Permissions from 'expo-permissions';
import {
    BarCodeScanner
} from 'expo-barcode-scanner';
import { Button, Container, Text, Icon } from 'native-base';

class ScanQR extends Component {
    state = {
        hasCameraPermission: null,
        scanned: false,
        isLogin: false,
        id_user: null
    };

    async componentDidMount() {
        try {
            let local = await AsyncStorage.getItem("user");
            let user = JSON.parse(local);
            if (user !== null) {
                this.setState({ isLogin: true, id_user: user.id })
                this.getPermissionsAsync();
            } else {
                this.props.navigation.replace("Login", { tab: 0 })
            }
        } catch (e) {
            console.log(e);
        }
    }

    getPermissionsAsync = async () => {
        const {
            status
        } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermission: status === 'granted'
        });
    };


    handleBarCodeScanned = ({ type, data }) => {
        this.setState({
            scanned: true
        });
        this.props.scanResult(data);
    }

    reScan = () => {
        this.setState({ scanned: false })
    }

    closeScreen = () => {
        this.props.closeScreen();
    }

    render() {
        const {
            hasCameraPermission,
            scanned,
            isLogin
        } = this.state;

        if (!isLogin) {
            return <Text style={{ textAlign: "center", marginTop: 20 }}>Đang chuyển đến đăng nhập</Text>;
        }

        if (hasCameraPermission === null) {
            return <Text style={{ textAlign: "center", marginTop: 20 }}>Yêu cầu quyền truy cập camera</Text>;
        }
        if (hasCameraPermission === false) {
            return <Text style={{ textAlign: "center", marginTop: 20 }}>Không truy cập được camera</Text>;
        }

        return <Container>
        {/* <Button danger><Text>Đóng</Text></Button> */}
            <ScrollView>
                <View style={{ height: Dimensions.get("screen").height }}>
                    <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
                        style={[StyleSheet.absoluteFill, styles.container]}
                        barCodeTypes={Object.values(BarCodeScanner.Constants.BarCodeType)}
                    >
                        <View style={styles.layerTop} />
                        <View style={styles.layerCenter}>
                            <View style={styles.layerLeft} />
                            <View style={styles.focused} />
                            <View style={styles.layerRight} />
                        </View>
                        <View style={styles.layerBottom} />
                    </BarCodeScanner>
                </View>

            </ScrollView>
            {scanned ? 
            <Button iconRight onPress={this.reScan} full><Text uppercase={false}>Thử quét lại</Text><Icon type="SimpleLineIcons" name="frame" /></Button> :
            <Button iconRight onPress={this.closeScreen} full danger><Text uppercase={false}>Đóng</Text><Icon type="SimpleLineIcons" name="close" /></Button>
            }
        </Container>

    }
}

export default ScanQR;

const opacity = 'rgba(0, 0, 0, .8)';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    layerTop: {
        flex: 1,
        backgroundColor: opacity
    },
    layerCenter: {
        flex: 3,
        flexDirection: 'row'
    },
    layerLeft: {
        flex: 1,
        backgroundColor: opacity
    },
    focused: {
        flex: 10
    },
    layerRight: {
        flex: 1,
        backgroundColor: opacity
    },
    layerBottom: {
        flex: 2,
        backgroundColor: opacity
    },
});