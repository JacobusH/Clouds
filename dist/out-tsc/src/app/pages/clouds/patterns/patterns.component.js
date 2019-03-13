import * as tslib_1 from "tslib";
import { Component, NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { DeviceService } from '../../../modules/shared/services/device.service';
import { PatternsService } from '../../../modules/shared/services/patterns.service';
import { Router, ActivatedRoute } from '@angular/router';
var PatternsComponent = /** @class */ (function () {
    function PatternsComponent(ble, ngZone, deviceService, router, actRoute, patternService) {
        this.ble = ble;
        this.ngZone = ngZone;
        this.deviceService = deviceService;
        this.router = router;
        this.actRoute = actRoute;
        this.patternService = patternService;
        this.displayMsg = 'Hallo';
        this.cloud1_interval = 100;
        this.cloud2_interval = 100;
        this.cloud3_interval = 100;
        this.buttons1 = [
            { cloudNum: 1, pattern: 'rainbow', isClicked: false },
            { cloudNum: 1, pattern: 'theater', isClicked: false },
            { cloudNum: 1, pattern: 'colorwipe', isClicked: false },
            { cloudNum: 1, pattern: 'scanner', isClicked: false },
            { cloudNum: 1, pattern: 'fade', isClicked: false }
        ];
        this.buttons2 = [
            { cloudNum: 2, pattern: 'rainbow', isClicked: false },
            { cloudNum: 2, pattern: 'theater', isClicked: false },
            { cloudNum: 2, pattern: 'colorwipe', isClicked: false },
            { cloudNum: 2, pattern: 'scanner', isClicked: false },
            { cloudNum: 2, pattern: 'fade', isClicked: false }
        ];
        this.buttons3 = [
            { cloudNum: 3, pattern: 'rainbow', isClicked: false },
            { cloudNum: 3, pattern: 'theater', isClicked: false },
            { cloudNum: 3, pattern: 'colorwipe', isClicked: false },
            { cloudNum: 3, pattern: 'scanner', isClicked: false },
            { cloudNum: 3, pattern: 'fade', isClicked: false }
        ];
    }
    PatternsComponent.prototype.ngOnInit = function () {
    };
    PatternsComponent.prototype.sendCmd = function (letter) {
        var _this = this;
        this.patternService.sendCommand(letter).then(function (info) {
            _this.displayMsg = 'Sent cmd' + letter + " | info: " + info;
        }, function (err) {
            _this.displayMsg = 'Err sending cmd' + letter + " | err: " + err;
        });
    };
    PatternsComponent.prototype.selectThis = function (cloud, btnIdx, cloudNum) {
        if (cloudNum == 1) {
            this.buttons1.forEach(function (button) { return button.isClicked = false; });
            this.buttons1[btnIdx].isClicked = true;
            this.patternService.sendPattern(cloudNum, cloud.pattern, this.cloud1_interval);
        }
        else if (cloudNum == 2) {
            this.buttons2.forEach(function (button) { return button.isClicked = false; });
            this.buttons2[btnIdx].isClicked = true;
            this.patternService.sendPattern(cloudNum, cloud.pattern, this.cloud2_interval);
        }
        else if (cloudNum == 3) {
            this.buttons3.forEach(function (button) { return button.isClicked = false; });
            this.buttons3[btnIdx].isClicked = true;
            this.patternService.sendPattern(cloudNum, cloud.pattern, this.cloud3_interval);
        }
    };
    PatternsComponent.prototype.changeInterval = function (cloudNum) {
        var _this = this;
        if (cloudNum == 1) {
            this.buttons1.forEach(function (cloud) {
                if (cloud.isClicked) {
                    _this.patternService.sendPattern(cloudNum, cloud.pattern, _this.cloud1_interval);
                }
            });
        }
        else if (cloudNum == 2) {
            this.buttons2.forEach(function (cloud) {
                if (cloud.isClicked) {
                    _this.patternService.sendPattern(cloudNum, cloud.pattern, _this.cloud2_interval);
                }
            });
        }
        if (cloudNum == 3) {
            this.buttons3.forEach(function (cloud) {
                if (cloud.isClicked) {
                    _this.patternService.sendPattern(cloudNum, cloud.pattern, _this.cloud3_interval);
                }
            });
        }
    };
    PatternsComponent.prototype.computeClass = function (cloud) {
        if (cloud.isClicked) {
            return 'cloud-btn active';
        }
        else {
            return 'cloud-btn inactive';
        }
    };
    PatternsComponent = tslib_1.__decorate([
        Component({
            selector: 'app-patterns',
            templateUrl: './patterns.component.html',
            styleUrls: ['./patterns.component.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [BLE,
            NgZone,
            DeviceService,
            Router,
            ActivatedRoute,
            PatternsService])
    ], PatternsComponent);
    return PatternsComponent;
}());
export { PatternsComponent };
//# sourceMappingURL=patterns.component.js.map