import { IntentRouter, INTENT_INIT } from "./core/intent-router"
import { RnnIntentRouter } from "./rnn"

const router = new IntentRouter()
const rnn = new RnnIntentRouter()
rnn.setRouter(router)
const pop = rnn.pop.bind(rnn)
const route = router.route.bind(router)
const intent = router.intent.bind(router)
const addMode = router.addMode.bind(router)
const registerScreen = rnn.registerScreen.bind(rnn)
const startApp = router.startApp.bind(router)

export {
  registerScreen,
  router,
  rnn,
  pop,
  route,
  intent,
  addMode,
  INTENT_INIT,
  startApp
}
