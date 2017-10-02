var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import React from 'react';
import { autorun } from 'mobx';
export const screens = new Map();
export let current;
export let currentNavigator = null;
export function WrapComponent(Component) {
    return class WrappedComponent extends React.Component {
        constructor(props = {}) {
            super(props);
            this.onNavigatorEvent = (event) => {
                const _a = this.props, { children, navigatorEventID, rootTag, navigatorID, screenInstanceID, testID, navigator, mode } = _a, props = __rest(_a, ["children", "navigatorEventID", "rootTag", "navigatorID", "screenInstanceID", "testID", "navigator", "mode"]);
                switch (event.id) {
                    case 'didAppear':
                        current = {
                            screen: screens.get(Component).screen,
                            mode: mode || (current && current.mode),
                            props
                        };
                        currentNavigator = navigator;
                        this.componentRef.componentDidAppear && this.componentRef.componentDidAppear();
                        break;
                    case 'bottomTabSelected':
                        break;
                }
            };
            this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        }
        _resolveState(props) {
            const { _resolve } = props, restProps = __rest(props, ["_resolve"]);
            if (_resolve) {
                const resolved = _resolve();
                return { props: Object.assign({}, restProps, resolved) };
            }
            else {
                return { props: restProps };
            }
        }
        componentWillMount() {
            let firstRun = true;
            this.state = this._resolveState(this.props);
            this.dismissAutorun = autorun(() => {
                const newState = this._resolveState(this.props);
                if (!firstRun) {
                    this.setState(newState);
                }
                firstRun = false;
            });
        }
        componentWillUnmount() {
            this.dismissAutorun && this.dismissAutorun();
        }
        render() {
            return React.createElement(Component, Object.assign({}, this.state.props, { ref: (ref) => this.componentRef = ref }));
        }
    };
}
export function registerScreen(name, screen) {
    if (typeof name !== "string") {
        screen = name;
        name = screen.name;
    }
    name = name + "#" + Math.floor(Math.random() * 10000);
    screens.set(screen, { screen, name });
}
export function getScreenName(screen) {
    const screenData = screens.get(screen);
    if (!screenData) {
        throw new Error(`${screen} cannot be found. Make sure to use registerScreen`);
    }
    return screenData.name;
}
//# sourceMappingURL=screen.js.map