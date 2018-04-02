import {IntentRouter,INTENT_INIT,} from '../../src/core/intent-router';
import {Command,COMMAND_TYPE_CHANGE_MODE} from "../../src/core/command-resolver";
import React from 'react';
async function identityHandler(...args):Promise<any>{
  return args;
}

class First extends React.Component {
  render(){
    return null;
  }
}
test("when starting app, should fire init intent",async ()=>{
  const calls =[];
  const router = new IntentRouter<any>();
  router.onIntent = async (intent,command)=>calls.push(command);
  router.route({
    when:INTENT_INIT,
    to:First
  });

  await router.startApp();
  const command = calls[calls.length - 1];
  expect(command.type).toEqual(COMMAND_TYPE_CHANGE_MODE);
  expect(command.change.screen).toEqual(First);
});

test("when calling intent, should process relevant route",()=>{
  const calls =[];
  const router = new IntentRouter<any>();
  router.onIntent = async (intent,command)=>calls.push(command);
  router.route({
    when:"MY_ROUTE",
    to:First
  })
  router.intent("MY_ROUTE");
  const command = calls[calls.length - 1];
  expect(command.type).toEqual(COMMAND_TYPE_CHANGE_MODE);
  expect(command.change.screen).toEqual(First);
});

test("when calling intent with new mode, should update new mode",()=>{

});
