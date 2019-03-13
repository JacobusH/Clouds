import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { StorageService } from '../../modules/shared/services/storage.service';
import { PatternsService } from '../../modules/shared/services/patterns.service';
var PatternsComponent = /** @class */ (function () {
    function PatternsComponent(storageService, patService) {
        this.storageService = storageService;
        this.patService = patService;
    }
    PatternsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.storageService.getClouds().then(function (x) {
            // x is an array of clouds
            if (x) {
                _this.clouds = x;
            }
            else {
                _this.clouds = [_this.patService.createNewCloud()];
            }
            _this.curCloud = _this.clouds[0];
            _this.curBlock = _this.curCloud.buildingBlocks[0];
        });
    };
    PatternsComponent.prototype.setCurCloud = function (idx) {
        this.curCloud = this.clouds[idx];
    };
    PatternsComponent = tslib_1.__decorate([
        Component({
            selector: 'app-custom-patterns',
            templateUrl: './patterns.component.html',
            styleUrls: ['./patterns.component.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [StorageService,
            PatternsService])
    ], PatternsComponent);
    return PatternsComponent;
}());
export { PatternsComponent };
//# sourceMappingURL=patterns.component.js.map