import { Body, CheckBox, Container, Content, List, ListItem, Right, Text, Thumbnail } from 'native-base';
import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Myheader from '../../components/Myheader';
import Timeline from 'react-native-timeline-flatlist'
import { Rating } from 'react-native-ratings';
import ImageView from 'react-native-image-view';
class UserDetailStatus extends Component {
    state = {
        show: false,
        imageResult: []
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
        let img_result = data.wo_image;
        let fb = data.wo_feedback;

        let time = data.wo_history;
        let listFb = fb.list_fb;
        let fbPoint = Number(fb.fb_point);
        let timeline = [];
        time.forEach(item => {
            let obj = {
                // time: item.history_date,
                title: item.history_date,
                description: item.wo_state_name
            }
            timeline.push(obj);
        });

        let viewListFb = listFb.map((item, i) => {
            let value = item.it_value === "0" ? false : true;
            return <ListItem key={i} style={{ paddingLeft: 0 }} noIndent>
                <Body><Text>{item.it_name}</Text></Body>
                <Right>
                    <View style={{ flexDirection: "row" }}>
                        <CheckBox style={{ marginRight: 25 }} checked={!value} />
                        <CheckBox checked={value} />
                    </View>
                </Right>
            </ListItem>
        })
        return (
            <Container style={{ backgroundColor: "#f1f1f1" }}>
                <Myheader {...this.props} goBack={true} title="Trạng thái" />
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
                            <View style={{ marginBottom: 15, flexDirection: "row", paddingBottom: 5 }}>
                                {
                                    img_result.map(img => {
                                        return <TouchableOpacity onPress={() => this.showImage(img_result)}><Thumbnail style={{ marginRight: 5, borderRadius: 5 }} large square source={{ uri: img.file_name }} /></TouchableOpacity>
                                    })
                                }
                            </View>
                            <View style={{ borderBottomWidth: 1, borderBottomColor: "#ddd", marginBottom: 15 }}></View>
                            {/* <Text style={{ marginBottom: 5, fontSize: 14 }}>Kỹ thuật viên</Text>
                            <Text style={{ marginBottom: 20, fontWeight: "bold" }}>Nguyễn Văn B</Text> */}

                            <Timeline
                                showTime={false}
                                data={timeline}
                                titleStyle={{ fontWeight: "bold" }}
                            />
                            {listFb.length > 0 &&
                                <View>
                                    <View style={{ marginTop: 20 }}>
                                        <Rating
                                            showRating
                                            style={{ paddingVertical: 10 }}
                                            ratingCount={5}
                                            startingValue={fbPoint}
                                            showRating={false}
                                            imageSize={30}
                                            
                                        />
                                    </View>

                                    <List>
                                        <ListItem style={{ paddingLeft: 0 }} noIndent>
                                            <Body></Body>
                                            <Right>
                                                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                                    <Text style={{ fontSize: 12, marginRight: 5 }}>No</Text>
                                                    <Text style={{ fontSize: 12, marginLeft: 10 }}>Yes</Text>
                                                </View>
                                            </Right>
                                        </ListItem>
                                        {viewListFb}

                                    </List>
                                </View>
                            }

                        </View>
                    </View>

                </Content>
            </Container>
        );
    }
}

export default UserDetailStatus;