import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
var StorageService = /** @class */ (function () {
    function StorageService(storage) {
        this.storage = storage;
    }
    StorageService.prototype.setClouds = function (howMany) {
        this.storage.set('clouds', howMany);
    };
    StorageService.prototype.getClouds = function () {
        return this.storage.get('clouds');
    };
    StorageService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [Storage])
    ], StorageService);
    return StorageService;
}());
export { StorageService };
//# sourceMappingURL=storage.service.js.map