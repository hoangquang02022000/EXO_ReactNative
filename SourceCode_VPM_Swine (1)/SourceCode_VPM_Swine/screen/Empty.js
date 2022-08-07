import React, { Component } from 'react';
import { View, Text } from 'react-native';

class Empty extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View>
        <Text> Please wait... </Text>
      </View>
    );
  }
}

export default Empty;
