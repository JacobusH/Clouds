import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
var ScannerService = /** @class */ (function () {
    function ScannerService() {
        this.bhSub = new BehaviorSubject(true);
        this.isShowSettings$ = this.bhSub.asObservable();
    }
    ScannerService.prototype.toggleState = function () {
        this.bhSub.next(!this.bhSub.value);
    };
    ScannerService.prototype.setShowSettingsTrue = function () {
        this.bhSub.next(true);
    };
    ScannerService.prototype.setShowSettingsFalse = function () {
        this.bhSub.next(false);
    };
    ScannerService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], ScannerService);
    return ScannerService;
}());
export { ScannerService };
//# sourceMappingURL=scanner.service.js.map