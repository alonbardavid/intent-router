import React from 'react';
import {View,StyleSheet,Text,Button,TextInput} from 'react-native';
import {observer} from 'mobx-react';

export class MainScreen extends React.Component {

  state = {
    id:"1"
  }
  onChangeId = (id)=>{
    this.setState({id})
  }
  render(){
    const {toCounter,toParamed,toTabbed} = this.props;
    return <View style={[styles.scene,styles.white]} >
      <Text style={[styles.reverse]}>Main Screen</Text>
      <Button onPress={toCounter} title="To Counter"  />
      <Button onPress={toTabbed} title="To Tabbed"  />
      <Text style={{marginVertical:20}} >Change input and press go to navigate to a parameterized route</Text>
      <View style={{flexDirection:"row"}}>
        <TextInput value={this.state.id} onChangeText={this.onChangeId}/>
        <Button onPress={()=>toParamed({id:this.state.id})} title="Go"/>

      </View>

    </View>
  }
}
export class BlueScreen extends React.Component {
  render(){
    const {toMain} = this.props;
    return <View style={[styles.scene,styles.blue]} >
      <Text style={styles.reverse}>Blue screen</Text>
      <Button onPress={toMain} title="to main" />
    </View>
  }
}
export const CounterScene = observer(class CounterScene extends React.Component {
  render(){
    const {count,increment} = this.props;
    return <View style={[styles.scene,styles.green]} >
      <Text>Counter screen</Text>
      <Text>Current count: {count} </Text>
      <Button onPress={increment} title="increment counter" />
    </View>
  }
})
export class GreenScreen extends React.Component {
  render(){
    return <View style={[styles.scene,styles.green]} >
      <Text>Green screen</Text>
    </View>
  }
}
export class ParamedScene extends React.Component {
  render(){
    const {id} = this.props;
    return <View style={[styles.scene,styles.white]} >
      <Text>Paramed scene with id {id}</Text>
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
    color:"white"
  }
});
