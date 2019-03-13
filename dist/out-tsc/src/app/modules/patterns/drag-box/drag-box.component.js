import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
var DragBoxComponent = /** @class */ (function () {
    function DragBoxComponent() {
        this.style = {};
    }
    DragBoxComponent.prototype.ngOnInit = function () {
    };
    DragBoxComponent.prototype.validate = function (event) {
        var MIN_DIMENSIONS_PX = 50;
        if (event.rectangle.width &&
            event.rectangle.height &&
            (event.rectangle.width < MIN_DIMENSIONS_PX ||
                event.rectangle.height < MIN_DIMENSIONS_PX)) {
            return false;
        }
        return true;
    };
    DragBoxComponent.prototype.onResizeEnd = function (event) {
        this.style = {
            position: 'fixed',
            left: event.rectangle.left + "px",
            top: event.rectangle.top + "px",
            width: event.rectangle.width + "px",
            height: event.rectangle.height + "px"
        };
    };
    DragBoxComponent = tslib_1.__decorate([
        Component({
            selector: 'app-drag-box',
            templateUrl: './drag-box.component.html',
            styleUrls: ['./drag-box.component.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], DragBoxComponent);
    return DragBoxComponent;
}());
export { DragBoxComponent };
//# sourceMappingURL=drag-box.component.js.map