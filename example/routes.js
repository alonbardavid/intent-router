import {route,intent,INTENT_INIT, addMode,registerScreen} from 'intent-router'
import * as Scene from './scenes';
import {store} from './store';

registerScreen(Scene.ParamedScene);
addMode("SIMPLE",{

})
addMode("TABBED",{
  tabs:[
    {
      screen:Scene.BlueScreen,
      containerName:"blue",
      icon: require("./home.png"),
      props:()=>({
        toMain:intent("MAIN")
      })
    },
    {
      icon: require("./notification.png"),
      containerName:"green",
      screen:Scene.GreenScreen
    }
  ]
})
route({
  when:INTENT_INIT,
  mode:"SIMPLE",
  to:Scene.MainScreen,
  props: ()=>({
    toCounter:intent("COUNTER"),
    toParamed:intent("PARAMED"),
    toTabbed:intent("TABBED")
  })
});
route({
  when:"TABBED",
  mode:"TABBED",
  to:Scene.BlueScreen
})
route({
  when:"MAIN",
  mode:"SIMPLE",
  to:Scene.MainScreen,
  props: ()=>({
    toCounter:intent("COUNTER"),
    toParamed:intent("PARAMED"),
    toTabbed:intent("TABBED")

  })
})
route({
  when:"BLUE",
  to:Scene.BlueScreen,
  props: ()=>({
    toGreen:intent("GREEN")
  })
});
route({
  when:"GREEN",
  to:Scene.GreenScreen,
  props: ()=>({
    toBlue:intent("BLUE")
  })
});

route({
  when:"COUNTER",
  to:Scene.CounterScene,
  props: ()=>({
    count:store.count,
    increment:store.increment
  })
});
route({
  when:"PARAMED",
  resolve: async (prev,intent,params)=>{
    console.log("thing")
    return {
      mode: "SIMPLE",
      screen: Scene.ParamedScene,
      props: () => ({
        id: params.id
      })
    }
  }
});
