import { CloudsPage } from '../pages/clouds/clouds.page';
var CustomReuseStrategy = /** @class */ (function () {
    function CustomReuseStrategy() {
        this.handlers = {};
    }
    CustomReuseStrategy.prototype.shouldDetach = function (route) {
        return false;
    };
    CustomReuseStrategy.prototype.store = function (route, handle) {
        this.handlers[route.routeConfig.path] = null;
    };
    CustomReuseStrategy.prototype.shouldAttach = function (route) {
        return !!route.routeConfig && !!this.handlers[route.routeConfig.path];
    };
    CustomReuseStrategy.prototype.retrieve = function (route) {
        if (!route.routeConfig) {
            return null;
        }
        return this.handlers[route.routeConfig.path];
    };
    CustomReuseStrategy.prototype.shouldReuseRoute = function (future, curr) {
        return curr.component !== CloudsPage;
    };
    return CustomReuseStrategy;
}());
export { CustomReuseStrategy };
//# sourceMappingURL=route-reuse-strategy.js.map