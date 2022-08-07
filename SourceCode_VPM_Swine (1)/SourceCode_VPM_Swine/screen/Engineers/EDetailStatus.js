import { Body, Button, CheckBox, Container, Content, Item, List, ListItem, Right, Text, Textarea, Thumbnail, Label, Icon } from 'native-base';
import React, { Component } from 'react';
import { Dimensions, View, TouchableOpacity, Alert } from 'react-native';
import Myheader from '../../components/Myheader';
import Timeline from 'react-native-timeline-flatlist'
import { Rating } from 'react-native-ratings';
import * as ImagePicker from 'expo-image-picker';
import { ApiPostStatus } from '../../api/Task';
import { GetUserLocal, VpmPushNotification } from '../../func';
import ImageView from 'react-native-image-view';

class EDetailStatus extends Component {
    state = {
        images: [],
        note: "",
        show: false,
        imageResult: []
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

    handleFinish = async () => {

        let user = await GetUserLocal();
        let { images, note } = this.state;

        if (note === "") {
            Alert.alert("Thông báo", "Vui lòng nhập ghi chú");
            return false;
        }
        if (images.length < 3) {
            Alert.alert("Thông báo", "Vui lòng chọn 3 ảnh");
            return false;
        }

        let { data } = this.props.route.params;
        const formData = new FormData();
        images.forEach(item => {
            formData.append("files[]", item);
        })

        ApiPostStatus(data.id, "2", user.userid, user.db_name, this.state.note, formData, res => {
            if (res==='success'){
                VpmPushNotification("4", "Kỹ thuật đã hoàn thành công việc");
                Alert.alert("Thông báo","Đã gởi yêu cầu đánh giá");
                this.props.navigation.goBack();
            }
        })
    }

    handleNote = (note) => {
        this.setState({ note })
    }

    showImage = (item) => {
        let arr = [];
        item.forEach((item, i) => {
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
        this.setState({ imageResult: arr, show: true })
    }

    Close = () => {
        this.setState({ show: false })
    }


    render() {
        let { data } = this.props.route.params;

        let { images } = this.state;
        let time = data.wo_history;
        let img_result = data.wo_image_result;
        let timeline = [];
        time.forEach(item => {
            let obj = {
                // time: item.history_date,
                title: item.history_date,
                description: item.wo_state_name
            }
            timeline.push(obj);
        });
        return (
            <Container style={{ backgroundColor: "#f1f1f1" }}>
                <Myheader {...this.props} goBack={true} title="Chi tiết trạng thái" />
                <Content>
                    <ImageView
                        images={this.state.imageResult}
                        imageIndex={0}
                        onClose={this.Close}
                        isVisible={this.state.show}
                    />
                    <View style={{
                        margin: 15
                    }}>
                        <Text style={{ marginBottom: 10, fontWeight: "bold" }}>{data.orderdate}</Text>
                        <View style={{
                            backgroundColor: "white",
                            borderRadius: 15,
                            padding: 20,
                            marginBottom: 15
                        }}>
                            <Text style={{ marginBottom: 10, color: "green", textTransform: "uppercase", fontWeight: "bold" }}>{data.wono}</Text>
                            <Text style={{ marginBottom: 10, textTransform: "capitalize", fontWeight: "bold" }}>{data.mc_name_vn}</Text>
                            <Text style={{ marginBottom: 10, color: "#333", textTransform: "lowercase" }}>{data.er_name_vn}</Text>
                            {img_result.length>0&&<Text style={{ marginBottom: 10, color: "red", textTransform: "uppercase", fontWeight: "bold" }}>Ảnh kết quả</Text>}
                            <View style={{ borderBottomWidth: 1, borderBottomColor: "#ddd", marginBottom: 15, flexDirection: "row", paddingBottom: 5 }}>
                                {
                                    img_result.map(img => {
                                        return <TouchableOpacity onPress={() => this.showImage(img_result)}><Thumbnail style={{ marginRight: 5, borderRadius: 5 }} large square source={{ uri: img.file_name }} /></TouchableOpacity>
                                    })
                                }
                            </View>
                            {/* <Text style={{ marginBottom: 5, fontSize: 14 }}>Kỹ thuật viên</Text>
                            <Text style={{ marginBottom: 20, fontWeight: "bold" }}>Nguyễn Văn B</Text> */}

                            <Timeline
                                // timeStyle={{ textAlign: 'center', backgroundColor: '#f1f1f1', color: '#000', padding: 5, borderRadius: 13 }}
                                data={timeline}
                                showTime={false}
                                titleStyle={{ fontWeight: "bold" }}
                            />

                            {/* <View style={{ marginTop: 20 }}>
                                <Rating
                                    showRating
                                    // onFinishRating={this.ratingCompleted}
                                    style={{ paddingVertical: 10 }}
                                    ratingCount={5}
                                    startingValue={5}
                                    showRating={false}
                                    imageSize={30}
                                />
                            </View> */}

                            {/* <List>
                                <ListItem style={{ paddingLeft: 0 }} noIndent>
                                    <Body></Body>
                                    <Right>
                                        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                            <Text style={{ fontSize: 12, marginRight: 5 }}>No</Text>
                                            <Text style={{ fontSize: 12, marginLeft: 10 }}>Yes</Text>
                                        </View>
                                    </Right>
                                </ListItem>
                                <ListItem style={{ paddingLeft: 0 }} noIndent>
                                    <Body><Text>Work duration follow plan</Text></Body>
                                    <Right>
                                        <View style={{ flexDirection: "row" }}>
                                            <CheckBox style={{ marginRight: 25 }} checked={false} />
                                            <CheckBox checked={false} />
                                        </View>
                                    </Right>
                                </ListItem>
                                <ListItem style={{ paddingLeft: 0 }} noIndent>
                                    <Body><Text>Strong-Beautiful</Text></Body>
                                    <Right>
                                        <View style={{ flexDirection: "row" }}>
                                            <CheckBox style={{ marginRight: 25 }} checked={false} />
                                            <CheckBox checked={false} />
                                        </View>
                                    </Right>
                                </ListItem>
                            </List> */}

                            <Item regular style={{ marginTop: 15 }}>
                                <Textarea onChangeText={this.handleNote} placeholder="Nhập ghi chú" rowSpan={3}></Textarea>
                            </Item>

                            <Label style={{ marginTop: 10, marginBottom: 10 }}>Tải ảnh lên (03 ảnh)</Label>
                            <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 20 }}>
                                {images[0] === undefined ? <Button onPress={() => this.pickImage("0")} style={{ marginRight: 5 }} iconLeft bordered>
                                    <Icon name="image" type="FontAwesome" /><Text uppercase={false}>Ảnh</Text>
                                </Button> : <TouchableOpacity style={{ marginRight: 5 }} onPress={() => this.pickImage("0")}><Thumbnail square large source={{ uri: images[0].uri }} /></TouchableOpacity>}
                                {images[1] === undefined ? <Button onPress={() => this.pickImage("1")} style={{ marginRight: 5 }} iconLeft bordered>
                                    <Icon name="image" type="FontAwesome" /><Text uppercase={false}>Ảnh</Text>
                                </Button> : <TouchableOpacity style={{ marginRight: 5 }} onPress={() => this.pickImage("1")}><Thumbnail square large source={{ uri: images[1].uri }} /></TouchableOpacity>}
                                {images[2] === undefined ? <Button onPress={() => this.pickImage("2")} style={{ marginRight: 5 }} iconLeft bordered>
                                    <Icon name="image" type="FontAwesome" /><Text uppercase={false}>Ảnh</Text>
                                </Button> : <TouchableOpacity style={{ marginRight: 5 }} onPress={() => this.pickImage("2")}><Thumbnail square large source={{ uri: images[2].uri }} /></TouchableOpacity>}
                            </View>

                            <Button full rounded onPress={this.handleFinish}><Text uppercase={false}>Hoàn thành</Text></Button>


                        </View>
                    </View>


                </Content>
            </Container>
        );
    }
}

export default EDetailStatus;