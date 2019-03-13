import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { PatternsService } from '../../modules/shared/services/patterns.service';
import { routeAnimations } from '../../animations/routes.animation';
var CloudsPage = /** @class */ (function () {
    function CloudsPage(patService) {
        this.patService = patService;
    }
    CloudsPage.prototype.ngOnInit = function () {
    };
    CloudsPage.prototype.ngOnDestroy = function () {
    };
    CloudsPage = tslib_1.__decorate([
        Component({
            selector: 'app-clouds',
            templateUrl: './clouds.page.html',
            styleUrls: ['./clouds.page.scss'],
            animations: [routeAnimations]
        }),
        tslib_1.__metadata("design:paramtypes", [PatternsService])
    ], CloudsPage);
    return CloudsPage;
}());
export { CloudsPage };
//# sourceMappingURL=clouds.page.js.map