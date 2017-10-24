var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getScreenName, WrapComponent, screens, current, currentNavigator } from './screen';
import { resolveNext } from './route';
import { buildConfigFromMode, getCurrentMode } from './mode';
import { Navigation } from 'react-native-navigation';
import { merge, isPlainObject } from 'lodash';
import { autorun } from "mobx";
function noop() { return {}; }
function buildProps(command, extra) {
    if (command.props && typeof (command.props) !== "function") {
        throw new Error("props must be a function"); //because react-native freezes items passed to native
    }
    const mode = command.mode || (current && current.mode);
    return Object.assign({}, extra || {}, { _resolve: command.props || noop, mode });
}
function commandToPushOptions(command, extra) {
    const mode = getCurrentMode();
    return Object.assign({}, command, { screen: getScreenName(command.screen), passProps: buildProps(command, extra), navigatorStyle: merge(mode.screen && mode.screen.navigatorStyle, command.navigatorStyle || {}) });
}
export function startApp(config) {
    return __awaiter(this, void 0, void 0, function* () {
        screens.forEach(({ screen, name }) => Navigation.registerComponent(name, () => WrapComponent(screen)));
        const initCommand = yield resolveNext("INIT");
        if (initCommand === false) {
            throw new Error("must always have a default route - handle the INIT route");
        }
        setAppMode(initCommand);
    });
}
let observers = [];
function setAppMode(command, extra) {
    const navConfig = buildConfigFromMode(command.mode, command);
    observers.forEach(unregister => unregister());
    observers = [];
    try {
        if (!navConfig.tabs) {
            Navigation.startSingleScreenApp(navConfig);
        }
        else {
            Navigation.startTabBasedApp(navConfig);
            setTimeout(() => {
                navConfig.tabs.forEach((t) => {
                    if (t.badge) {
                        observers.push(autorun(() => {
                            setTabBadge(Object.assign({}, t.badge(), { tab: t.containerName }));
                        }));
                    }
                });
            }, 1000);
        }
    }
    catch (e) {
        console.error(e);
    }
}
export function intent(intent) {
    return function (params) {
        return __awaiter(this, void 0, void 0, function* () {
            params = isPlainObject(params) ? params : {};
            const command = yield resolveNext(intent, current, params);
            if (command == false) {
                return;
            }
            if (command.mode && command.mode != current.mode) {
                setAppMode(command, params);
            }
            if (command.reset) {
                currentNavigator.resetTo(commandToPushOptions(command, params));
            }
            else {
                currentNavigator.push(commandToPushOptions(command, params));
            }
        });
    };
}
export function switchToTab(containerName) {
    const mode = getCurrentMode();
    currentNavigator.switchToTab({
        tabIndex: mode.tabRef[containerName]
    });
}
export function showModal(command) {
    const pushOptions = commandToPushOptions(command);
    pushOptions.navigatorStyle.navBarHidden = pushOptions.navigatorStyle.navBarHidden == null ?
        true : pushOptions.navigatorStyle.navBarHidden;
    currentNavigator.showModal(pushOptions);
    return currentNavigator.dismissModal.bind(currentNavigator);
}
export function pop() {
    currentNavigator.pop();
}
export function popToRoot() {
    currentNavigator.popToRoot();
}
export function toggleDrawer(props) {
    currentNavigator.toggleDrawer(props);
}
export function setTabBadge(options) {
    const mode = getCurrentMode();
    if (mode && mode.tabRef && mode.tabRef[options.tab] >= 0) {
        const tabIndex = mode.tabRef[options.tab];
        currentNavigator.setTabBadge({
            tabIndex,
            badge: options.badge,
            badgeColor: options.badgeColor
        });
    }
}
//# sourceMappingURL=command.js.map