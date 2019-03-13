import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
var StateCircleComponent = /** @class */ (function () {
    function StateCircleComponent() {
        this.items = ['item1', 'item2', 'item3', 'item4', 'item4', 'item5',
            'item1', 'item2', 'item3', 'item4', 'item4', 'item5',
            'item1', 'item2', 'item3', 'item4', 'item4', 'item5',
            'item1', 'item2', 'item3', 'item4', 'item4', 'item5',
            'item1', 'item2', 'item3', 'item4'];
        this.menuRadius = 50;
        this.itemRadius = 5;
    }
    StateCircleComponent.prototype.ngOnInit = function () {
        this.step = (2 * Math.PI) / this.items.length;
        this.angle = 0;
    };
    StateCircleComponent.prototype.determineItemCX = function (position) {
        this.angle = position * this.step;
        return Math.round(this.itemRadius / 2 + this.menuRadius * Math.cos(this.angle) - this.itemRadius / 2) + this.menuRadius + this.itemRadius;
    };
    StateCircleComponent.prototype.determineItemCY = function (position) {
        this.angle = position * this.step;
        return Math.round(this.itemRadius / 2 + this.menuRadius * Math.sin(this.angle) - this.itemRadius / 2) + this.menuRadius + this.itemRadius;
    };
    tslib_1.__decorate([
        Input('items'),
        tslib_1.__metadata("design:type", Object)
    ], StateCircleComponent.prototype, "items", void 0);
    tslib_1.__decorate([
        Input('menuRadius'),
        tslib_1.__metadata("design:type", Number)
    ], StateCircleComponent.prototype, "menuRadius", void 0);
    tslib_1.__decorate([
        Input('itemRadius'),
        tslib_1.__metadata("design:type", Object)
    ], StateCircleComponent.prototype, "itemRadius", void 0);
    StateCircleComponent = tslib_1.__decorate([
        Component({
            selector: 'app-state-circle',
            templateUrl: './state-circle.component.html',
            styleUrls: ['./state-circle.component.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], StateCircleComponent);
    return StateCircleComponent;
}());
export { StateCircleComponent };
//# sourceMappingURL=state-circle.component.js.map