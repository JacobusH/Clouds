import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BLE } from '@ionic-native/ble/ngx';
var DeviceService = /** @class */ (function () {
    function DeviceService(ble) {
        this.ble = ble;
        this.bhSub = new BehaviorSubject(false);
        this.isConnected$ = this.bhSub.asObservable();
        // NeoPixel Service UUIDs
        this.serviceCloud1 = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
        this.txCloud1 = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'; // Write, Write w/o resp
        this.rxCloud1 = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
        this.service1800 = '1800';
        this.CHARAC_2a00 = '2a00'; // Read, Write
        this.CHARAC_2a01 = '2a01'; // Read
        this.CHARAC_2a04 = '2a04'; // Read
        this.service1801 = '1801';
        this.CHARAC_2a05 = '2a05'; // Indicate
    }
    DeviceService.prototype.toggleState = function () {
        this.bhSub.next(!this.bhSub.value);
    };
    DeviceService.prototype.setConnectedFalse = function () {
        this.bhSub.next(false);
    };
    DeviceService.prototype.setConnectedTrue = function () {
        this.bhSub.next(true);
    };
    DeviceService.prototype.setDevice = function (device) {
        this.selectedDevice = device;
    };
    DeviceService.prototype.setPeripheral = function (peripheral) {
        this.peripheral = peripheral;
        this.peripheralInfo = JSON.stringify(peripheral); // show as JSON
        this.piServices = this.peripheral['services'];
        this.piCharacs = this.peripheral['characteristics'];
        // setup the neopixel rings
        var data = new Uint8Array([0x53]); // S
        this.ble.write(this.peripheral.id, this.serviceCloud1, this.txCloud1, data.buffer);
    };
    DeviceService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [BLE])
    ], DeviceService);
    return DeviceService;
}());
export { DeviceService };
//# sourceMappingURL=device.service.js.map