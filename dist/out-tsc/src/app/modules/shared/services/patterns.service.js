import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { DeviceService } from './device.service';
import { v4 as uuid } from 'uuid';
var PatternsService = /** @class */ (function () {
    function PatternsService(ble, deviceService) {
        this.ble = ble;
        this.deviceService = deviceService;
        this.colPatters = '!Patterns';
        this.PATTERNS = { 'rainbow': 'rainbow', 'theater': 'theater', 'colorwipe': 'colorwipe', 'scanner': 'scanner', 'fade': 'fade' };
    }
    PatternsService.prototype.createNewCloud = function () {
        return {
            cloudID: uuid(),
            numPixels: 24,
            curBrightness: 125,
            isActive: true,
            buildingBlocks: [{
                    blockID: uuid(),
                    pixels: Array().fill('#8B008B', 0, 23) // arr of clouds hex colors in position
                }]
        };
    };
    // Commands to send to controller
    PatternsService.prototype.sendCommand = function (cmd) {
        var data = new TextEncoder().encode(cmd);
        return this.ble.write(this.deviceService.peripheral.id, this.deviceService.serviceCloud1, this.deviceService.txCloud1, data.buffer);
    };
    PatternsService.prototype.setBrightness = function (brightness) {
        console.log('setBrightness');
        var cmd = new Uint8Array([0x42, brightness]); // send B
        this.ble.write(this.deviceService.peripheral.id, this.deviceService.serviceCloud1, this.deviceService.txCloud1, cmd.buffer).then(function () {
            console.log('Sent B');
        }, function () { return console.log('Error updating brightness'); });
    };
    PatternsService.prototype.sendPattern = function (cloudNum, pattern, interval) {
        console.log('patternservice', cloudNum, pattern, interval);
        var hexxy = 0x41;
        if (pattern == this.PATTERNS.rainbow) { // RAINBOW_CYCLE, A
            hexxy = 0x41;
        }
        else if (pattern == this.PATTERNS.theater) { // THEATER_CHASE, C
            hexxy = 0x43;
        }
        else if (pattern == this.PATTERNS.colorwipe) { // COLOR_WIPE, D
            hexxy = 0x44;
        }
        else if (pattern == this.PATTERNS.scanner) { // SCANNER, E
            hexxy = 0x45;
        }
        else if (pattern == this.PATTERNS.fade) { // FADE, F
            hexxy = 0x46;
        }
        else if (pattern == 'Y') { // ON, Y
            hexxy = 0x59;
        }
        else if (pattern == 'Z') { // OFF, Z
            hexxy = 0x5A;
        }
        var cmd = new Uint8Array([hexxy, cloudNum, interval]); // send cloudNum, pattHex, timingInterval
        return this.ble.write(this.deviceService.peripheral.id, this.deviceService.serviceCloud1, this.deviceService.txCloud1, cmd.buffer);
    };
    PatternsService.prototype.getPatternHex = function (patternLett) {
        switch (patternLett) {
            case 'A': {
                return 0x42;
            }
        }
    };
    PatternsService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [BLE,
            DeviceService])
    ], PatternsService);
    return PatternsService;
}());
export { PatternsService };
//# sourceMappingURL=patterns.service.js.map