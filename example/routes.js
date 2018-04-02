import {route,intent,INTENT_INIT, addMode} from 'intent-router'
import * as Scene from './scenes';

addMode("SIMPLE",{

})
route({
  when:INTENT_INIT,
  mode:"SIMPLE",
  to:Scene.WhiteScreen,
  props: ()=>({
    toBlue:intent("BLUE"),
    toGreen:intent("GREEN")
  })
});

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
