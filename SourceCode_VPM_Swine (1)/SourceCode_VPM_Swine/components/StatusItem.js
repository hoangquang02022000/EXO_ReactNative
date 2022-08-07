import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Text, Thumbnail, Button } from 'native-base';
import * as Progress from 'react-native-progress';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImageView from 'react-native-image-view';
import { UserType } from '../func';

class StatusItem extends Component {
    state = {
        images: [],
        show: false
    }

    showImage = () => {
        let { wo_image } = this.props;
        let arr = [];
        wo_image.forEach((item, i) => {
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
        this.setState({ images: arr, show: true })

    }

    Close = () => {
        this.setState({ show: false })
    }

    render() {
        let {wo_state_code} = this.props;
        let bar = 0.01;
        let bg = "blue";
        switch (wo_state_code) {
            case "11":
                bar = 0.01;
                break;
            case "12":
                bar = 0.25;
                bg = "#ffcc29"
                break;
            case "13":
                bar = 0.5;
                bg = "#8b5e83"
                break;
            case "14":
                bar = 0.75;
                bg = "#51c2d5"
                break;
            case "15":
                bar = 1;
                bg = "#61b15a"
                break;
            case "16":
                bar = 0.01;
                bg = "#ff0000"
                break;
            case "17":
                bar = 0.25;
                bg = "#ffcc29"
                break;
            default:
                break;
        }
        return (<View style={{
            backgroundColor: "white",
            borderRadius: 15,
            padding: 20,
            borderLeftWidth: 5,
            borderLeftColor: bg,
            marginBottom: 15
        }}>
            <ImageView
                images={this.state.images}
                imageIndex={0}
                onClose={this.Close}
                isVisible={this.state.show}
            // renderFooter={(currentImage) => (<View><Text>My footer</Text></View>)}
            />
            <Text style={{ marginBottom: 10, fontWeight: "bold", textTransform: "uppercase", color: "green" }}>{this.props.wono}</Text>
            <Text style={{ marginBottom: 10, fontWeight: "bold", textTransform: "capitalize" }}>{this.props.mc_name_vn}</Text>
            <Text style={{ marginBottom: 10, color: "#333", textTransform: "lowercase" }}>{this.props.er_name_vn}</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={style.itemStatus}>
                {
                    wo_state_code==="14" || wo_state_code==="15"?
                    this.props.wo_image_result.map(img => {
                        return <TouchableOpacity onPress={this.showImage}><Thumbnail style={{ marginRight: 5, borderRadius: 5 }} large square source={{ uri: img.file_name }} /></TouchableOpacity>
                    }):
                    this.props.wo_image.map(img => {
                        return <TouchableOpacity onPress={this.showImage}><Thumbnail style={{ marginRight: 5, borderRadius: 5 }} large square source={{ uri: img.file_name }} /></TouchableOpacity>
                    })
                }
            </ScrollView>
            <Progress.Bar color={bg} progress={bar} width={Dimensions.get("screen").width - 74} />
            <Text style={{ marginTop: 5, marginBottom: 10 }}>{this.props.wo_state_name}</Text>
            {this.props.rule === UserType.Engineer && <Button full style={{borderRadius: 5}} onPress={() => this.props.navigation.navigate("EDetailStatus", { data: this.props.data })}><Text uppercase={false}>Xem chi tiết</Text></Button>}
            {this.props.rule === null && <Button full style={{borderRadius: 5}} onPress={() => this.props.navigation.navigate("UserDetailStatus", { data: this.props.data })}><Text uppercase={false}>Xem chi tiết</Text></Button>}
        </View>)
    }
}

export default StatusItem;


StatusItem.defaultProps = {
    rule: null
}

const style = StyleSheet.create({
    itemStatus: {
        borderBottomWidth: 1,
        paddingBottom: 15,
        borderBottomColor: "#ddd",
        marginBottom: 10
    }
})