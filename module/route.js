var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const fromRoutes = new Map();
const whenRoutes = new Map();
const matchRoutes = [];
export function addRoute(options) {
    if (options.from) {
        fromRoutes.set(options.from, (fromRoutes.get(options.from) || []).concat(options));
    }
    else if (options.when) {
        whenRoutes.set(options.when, options);
    }
    else {
        matchRoutes.push(options);
    }
}
function processResolve(route, state, intent, params) {
    return __awaiter(this, void 0, void 0, function* () {
        state = state || {};
        if (route.resolve) {
            const resolved = yield route.resolve(state, intent, params);
            if (typeof (resolved) != "object") {
                return false;
            }
            return Object.assign({ navigatorStyle: route.navigatorStyle }, resolved, { mode: resolved.mode || route.mode, reset: route.reset });
        }
        return Object.assign({}, state, { screen: route.to, props: route.props, mode: route.mode, navigatorStyle: route.navigatorStyle, reset: route.reset });
    });
}
export function resolveNext(intent, current, params) {
    return __awaiter(this, void 0, void 0, function* () {
        let routes = current ? fromRoutes.get(current.screen) : [];
        let route = null;
        if (routes) {
            for (route of routes) {
                if (route.when == intent) {
                    return yield processResolve(route, current, intent, params);
                }
                else {
                    if (route.match && route.match(current, intent)) {
                        return yield processResolve(route, current, intent, params);
                    }
                }
            }
        }
        route = whenRoutes.get(intent);
        if (route) {
            return yield processResolve(route, current, intent, params);
        }
        for (route of matchRoutes) {
            if (route.when == intent) {
                return yield processResolve(route, current, intent, params);
            }
            else {
                if (route.match && route.match(current, intent)) {
                    return yield processResolve(route, current, intent, params);
                }
            }
        }
    });
}
//# sourceMappingURL=route.js.map