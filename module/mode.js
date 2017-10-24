import { getScreenName, current } from './screen';
import { cloneDeep } from 'lodash';
const modes = {};
export function addMode(name, modeConfig) {
    const tabRef = (modeConfig.tabs || []).reduce((obj, tab, i) => { obj[tab.containerName] = i; return obj; }, {});
    modes[name] = Object.assign({}, modeConfig, { tabRef });
}
function buildProps(command, modeName) {
    const mode = modeName || command.mode || (current && current.mode);
    if (typeof (command.props) == "function") {
        return {
            _resolve: command.props,
            mode
        };
    }
    return Object.assign({}, command.props, { mode });
}
function buildTabConfig(modeName, tab, command) {
    return Object.assign({}, tab, { screen: getScreenName((command && command.screen) || tab.screen), passProps: command ? buildProps(command) : buildProps(tab, modeName), navigatorStyle: buildNavigatorStyle(tab, command) });
}
function buildNavigatorStyle(style, command) {
    const navigatorStyle = Object.assign({}, (style && style.navigatorStyle), (command.navigatorStyle || {}));
    navigatorStyle.navBarCustomView = navigatorStyle.navBarCustomView && getScreenName(navigatorStyle.navBarCustomView);
    return navigatorStyle;
}
export function buildConfigFromMode(modeName, command) {
    const mode = modes[modeName];
    let config;
    if (mode.tabs) {
        config = Object.assign({}, mode);
        config.tabs = config.tabs.map(tab => buildTabConfig(modeName, tab, tab.containerName == command.container && command));
        config.appStyle = config.tabsStyle;
    }
    else {
        config = Object.assign({}, mode);
        config.screen = {
            screen: getScreenName(command.screen),
            navigatorStyle: buildNavigatorStyle(mode.screen, command)
        };
        config.passProps = buildProps(command);
    }
    if (mode.drawer) {
        config.drawer = Object.assign({}, mode.drawer, { left: mode.drawer.left && {
                screen: getScreenName(mode.drawer.left.screen),
                passProps: buildProps(mode.drawer.left)
            } });
    }
    return cloneDeep(config);
}
export function getCurrentMode() {
    return modes[current && current.mode];
}
export { modes };
//# sourceMappingURL=mode.js.map