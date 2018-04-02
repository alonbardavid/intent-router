import React from 'react';
import {View,StyleSheet,Text,Button} from 'react-native';

export class BlueScreen extends React.Component {
  render(){
    const {toGreen} = this.props;
    return <View style={[styles.scene,styles.blue]} >
      <Text>Blue screen</Text>
      <Button onPress={toGreen} title="To Green"  />
    </View>
  }
}
export class GreenScreen extends React.Component {
  render(){
    const {toBlue} = this.props;
    return <View style={[styles.scene,styles.green]} >
      <Text>Green screen</Text>
      <Button onPress={toBlue} title="To Blue"/>
    </View>
  }
}
export class RedScreen extends React.Component {
  render(){
    return <View style={[styles.scene,styles.red]} >
      <Text>Red screen</Text>
    </View>
  }
}
export class WhiteScreen extends React.Component {
  render(){
    const {toGreen,toBlue} = this.props;
    return <View style={[styles.scene,styles.white]} >
      <Text style={[styles.reverse]}>White screen</Text>
      <Button onPress={toGreen} title="To Green"  />
      <Button onPress={toBlue} title="To Blue"/>

    </View>
  }
}
export class BlackScreen extends React.Component {
  render(){
    return <View style={[styles.scene,styles.black]} >
      <Text>Black screen</Text>
    </View>
  }
}



const styles = StyleSheet.create({
  scene:{
    width:"100%",
    height:"100%",
    flexDirection:"column",
    justifyContent:"center",
    alignItems:"center"
  },
  blue:{
    backgroundColor:"blue"
  },
  red:{
    backgroundColor:"red"
  },
  green:{
    backgroundColor:"green"
  },
  white:{
    backgroundColor:"white"
  },
  black:{
    backgroundColor:"black"
  },
  reverse:{
    color:"black"
  }
});
