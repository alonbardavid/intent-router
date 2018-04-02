# Intent router

A router abstraction over React-native-navigation and Mobx.   
It provides a concise way to separate navigation and app structure from how something is displayed.

### Installation

```bash
yarn add intent-router

or 

npm install --save intent-router

```

Intent-router requires [React-native-navigation](https://github.com/wix/react-native-navigation) and [mobx](https://github.com/mobxjs/mobx) , 
follow the installation for both

### Usage

Intent-router is declarative and requires you to define all your routes before
you start navigation.

The simplest intent-router file is this:

```js
import React from 'react';
import {View,Text,Button} from 'react-native';
import {route,intent,INTENT_INIT,startApp,addMode} from 'intent-router'

export class HelloWorldScene extends React.Component {
   render(){
     const {next} = this.props;
     return <View>
       <Text>Hello World</Text>
       <Button title="next" onPress={next} />
     </View>
   }
 }
export class NextScene extends React.Component {
  render(){
    return <View>
      <Text>Next</Text>
    </View>
  }
}
//every app requires at least one mode, which defines the layout
addMode("SIMPLE",{ 

})
//a route describes an action
route({
  when:INTENT_INIT,
  mode:"SIMPLE",
  to:HelloWorldScene,
  props: ()=>({
    next:intent("ON_NEXT")
  })
});
route({
  when:"ON_NEXT",
  to:NextScene
});
startApp();


```

You can see a fuller example in the [Example folder](./example).   

With Intent-router your ui components don't know where and how they are displayed. They receive
actions from the container (in the example above `HelloWorldScene` gets the `next` action from it's props)

There are 3 concepts in Intent-router that you need to be familiar with:

* Intent - an event that requires the router to handle it. In the above example that'll be `INTENT_INIT` and `ON_NEXT`
* Route - a declaration of an action that needs to be taken when a certain intent happens. This is the meat of what Intent-router does
* Mode - the layout of the app. Most apps have several layouts (for instance a simple page layout for login page and a tab layout for inner pages). Modes can be switched when routes are resolved.

#### intents
Intents are sent using the `intent` export from `intent-router` module. 

They can be called directly, for example:

```js
import {intent} from 'intent-router'

intent("NEXT")({});

```

But to preserve separation between ui and navigation, you should send it as a prop from the route

```js
import React from 'react';
import {intent,route} from 'intent-router'

route({
  to:SomeScene,
  props: ()=>({
    next:intent("NEXT")
  })
})

class SomeScene {
  ...
  onPressButton(){
    const {next} = this.props;
    next({id:4,otherProp:"cool"})
  }
  render(){
    ...
  } 
    
}


```

As demonstrated in the previous example, aside from a name, intents can also send properties.

#### routes
Routes define transitions that happen when a certain intent occurs.

The simplest route is a route that directs to a scene when an intent of a certain type occurs.

```js
route({
  when:"SOME-INTENT",
  to:SomeScene
})
```

All apps must have at least one simple route with the when as `INTENT_INIT` from intent-router.

A route can also define a transition only if an intent happens when a certain scene is in focus.

```js
route({
  from:"FIRST-SCENE",
  when:"NEXT",
  to:"SECOND-SCENE"
})
```

Routes can pass properties to the scenes - by sending a function in props.

```js
route({
  when:"SOME-INTENT",
  to:SomeScene,
  props:()=>({ //props does not receive any arguments
    someProp:"cool"
  })
})
```

Routes can have their scenes and props dynamically resolved:

```js
route({
  when:"SOME-INTENT",
  resolve: (currentNavState,intent,params)=>{
    //do something with params, like getting information from a store
    const item = ItemStore.items[params.id];
    return {
      screen:SomeScene,
      props:()=>({
        item:item,
        id:params.id
      })
    }
  }
})
```


#### Modes

Modes are definitions of the apps layout - there are currently 2 supported layouts - single and tabbed.

A simple single screen layout can be defined like this:

```js
import {addMode, route,INTENT_INIT} from 'intent-router';

addMode("basic",{
screen: {
  drawer: {
    // optional, add this if you want a side menu drawer in your app
    left: {
      screen: MenuScene, 
      disableOpenGesture: false, 
      fixedWidth: 500 
    }
  },
  animationType: 'slide-down' // optional, add transition animation to root change: 'none', 'slide-down', 'fade'

})

route({
  when:INTENT_INIT,
  mode:"basic",
  title:"welcome",
  to:WelcomeScene,
  navigatorStyle:{}  
})
```

Note that unlike in `react-native-navigation`, you don't need to define the screen inside the mode.

For tabbed based apps however, you must define initial scene for each tab:

```js
import {addMode, route,INTENT_INIT} from 'intent-router';

addMode("my-tabbed-mode",{
screen: {
  tabs: [
    {
      screen:FirstTabScene,
      navigatorStyle:{},
      props:()=>({})
    },
    {
      screen:SecondTabScene,
      navigatorStyle:{},
      props:()=>({})
    }
  ],
  drawer: {
    // optional, add this if you want a side menu drawer in your app
    left: {
      screen: MenuScene, 
      disableOpenGesture: false, 
      fixedWidth: 500 
    }
  }
})

route({
  when:"LOGIN",
  mode:"my-tabbed-mode",
  to:FirstTabScene,
  navigatorStyle:{}  
})
```

### mobx integration

When sending props to a scene, the prop function is observed using mobx. In a similar manner to render props.   
That means that if the props function returns a property from a store, the scene will rerender when the property changes.

### React-native-navigation integration

All properties in mode are sent to either `startSingleScreenApp` or `startTabBasedApp` - so you can send properties such as navigatorStyle.

If you want to use a component as a scene in intent-router you must register the screen via `registerScreen` from the `intent-router` module.
However any component that is inside a `to` field of a route is automatically registered.

