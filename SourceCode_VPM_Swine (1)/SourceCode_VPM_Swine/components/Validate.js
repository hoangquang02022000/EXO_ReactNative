import { Alert } from "react-native";

export const isEmpty = (str, field) => {
    if (str === "" || str === null) {
        //Alert.alert("Thông báo", "Vui lòng không bỏ trống " + field)
        return false;
    }
    return true;
}

export const isEmptyMayPhat = (str, field) => {
    if (str === "" || str === null) {
        Alert.alert("Thông báo", "Vui lòng không bỏ trống " + field)
        return false;
    }
    return true;
}

export const isEmptyTools = (str, field) => {
    if (str === "" || str === null) {
        Alert.alert("Thông báo", "Vui lòng không bỏ trống " + field)
        return false;
    }
    return true;
}

export const isPhone = (str) => {
    if (str === "" || str === null || str.length !== 10 || str.substring(0, 1) !== "0") {
        Alert.alert("Thông báo", "Vui lòng nhập đúng số điện thoại")
        return false;
    }
    return true;
}

export const isPassword = (str) => {
    if (str === "" || str === null || str.length < 6) {
        Alert.alert("Thông báo", "Mật khẩu ít nhất 6 ký tự")
        return false;
    }
    return true;
}

export const matchPassword = (password, retype) => {
    if (password !== retype) {
        Alert.alert("Thông báo", "Nhập lại mật khẩu không khớp")
        return false;
    }
    return true;
}

export const isAccept = (condition) => {
    if (condition === false) {
        Alert.alert("Thông báo", "Vui lòng đồng ý với những điều khoản của chúng tôi")
        return false;
    }
    return true;
}

export const checkUnique = (arr, comp) => {
    let check = true;
    arr.forEach(item => {
        if (item.Product_Code === comp.Product_Code)
            check = false;
        return false;
    })
    return check;
}   