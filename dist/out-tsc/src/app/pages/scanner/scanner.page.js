import * as tslib_1 from "tslib";
import { Component, NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { DeviceService } from '../../modules/shared/services/device.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ScannerService } from '../../modules/shared/services/scanner.service';
// import { AlertController } from 'ionic-angular';
var NEOPIXEL_SERVICE = 'ccc0';
var ScannerPage = /** @class */ (function () {
    function ScannerPage(ble
    // , private alertCtrl: AlertController,
    , ngZone, deviceService, router, actRoute, scannerService) {
        this.ble = ble;
        this.ngZone = ngZone;
        this.deviceService = deviceService;
        this.router = router;
        this.actRoute = actRoute;
        this.scannerService = scannerService;
        this.devices = [];
        this.displayMessage = "Hallo";
        this.logMessage = "No device selected";
        // cloudsDeviceID = "C6:50:3F:C2:27:DB"; // Jeanne's
        this.cloudsDeviceID = "EC:73:E7:89:67:01"; // mine
    }
    ScannerPage.prototype.ngOnInit = function () {
        // this.ngZone.run(() => {
        //   this.scannerService.isShowSettings$.subscribe(toShow => {
        //     if(toShow) {
        //       this.isShowSettings = true;
        //       this.scan(false); // scan and only show list, allow them to pick which to connect
        //     }
        //     else {
        //       this.isShowSettings = false;
        //       this.scan(true); // scan and connect to hardcoded device
        //     }
        //   })
        // })
    };
    ScannerPage.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.ngZone.run(function () {
            _this.scannerService.isShowSettings$.subscribe(function (toShow) {
                if (toShow) {
                    _this.isShowSettings = true;
                    _this.scan(false); // scan and only show list, allow them to pick which to connect
                }
                else {
                    _this.isShowSettings = false;
                    _this.scan(true); // scan and connect to hardcoded device
                }
            });
        });
    };
    ScannerPage.prototype.displayMsg = function (msg) {
        var _this = this;
        this.ngZone.run(function () {
            _this.displayMessage = msg;
        });
    };
    ScannerPage.prototype.scan = function (auto) {
        var _this = this;
        this.ngZone.run(function () {
            // this.ble.scan([], 60).subscribe(
            _this.devices = []; // clear existing list
            _this.displayMsg("in scanning mode");
            _this.ble.scan([], 6).subscribe(function (device) {
                _this.displayMsg("Found device: " + JSON.stringify(device));
                _this.onDiscoveredDevice(device);
                // NOTE: use this for auto connect
                if (auto && device.id == _this.cloudsDeviceID) {
                    _this.deviceSelected(device);
                }
            }, function (err) {
                _this.displayMsg("Error occurred during BLE scan: " + JSON.stringify(err));
                console.log("Error occurred during BLE scan: " + JSON.stringify(err));
            }, function () {
                _this.displayMsg("End of devices...");
                console.log("End of devices…");
            });
        });
        console.log('Scanning for Bluetooth LE Devices');
    };
    ScannerPage.prototype.onDiscoveredDevice = function (device) {
        var _this = this;
        console.log('Discovered ' + JSON.stringify(device, null, 2));
        this.ngZone.run(function () {
            _this.displayMsg('Discovered ' + JSON.stringify(device, null, 2));
            _this.devices.push(device);
        });
    };
    ScannerPage.prototype.deviceSelected = function (device) {
        var _this = this;
        this.ngZone.run(function () {
            console.log(JSON.stringify(device) + ' selected');
            _this.logMessage = "Device Selected: ";
            _this.deviceService.setDevice(device);
            _this.ble.connect(_this.deviceService.selectedDevice.id).subscribe(function (peripheral) { return _this.onConnected(peripheral); }, function (peripheral) { return _this.onDeviceDisconnected(peripheral); });
            _this.router.navigateByUrl('/home/clouds', { queryParams: { device: JSON.stringify(device) } });
        });
    };
    ScannerPage.prototype.onConnected = function (peripheral) {
        var _this = this;
        this.ngZone.run(function () {
            // this.connected = true;
            _this.deviceService.setConnectedTrue();
            _this.deviceService.setPeripheral(peripheral);
            // this.displayMsg = 'Connected to: ' + peripheral.name + ' ' + peripheral.id;
            // this.otherInfo = "service: " + this.deviceService.serviceCloud1 + "tx: " + this.deviceService.txCloud1;
            _this.ble.startNotification(peripheral.id, _this.deviceService.serviceCloud1, _this.deviceService.rxCloud1).subscribe(function (buffer) {
                var data = new Uint8Array(buffer);
                console.log('Received Notification: Power Switch = ' + data);
                _this.ngZone.run(function () {
                    // this.displayMsg = "started notifs";
                    // this.power = data[0] !== 0;
                });
            });
        });
    };
    ScannerPage.prototype.onDeviceDisconnected = function (peripheral) {
        this.deviceService.setConnectedFalse();
        // let toast = this.toastCtrl.create({
        //   message: 'The peripheral unexpectedly disconnected',
        //   duration: 3000,
        //   position: 'center'
        // });
        // toast.onDidDismiss(() => {
        //   console.log('Dismissed toast');
        //   // TODO navigate back?
        // });
        // toast.present();
    };
    ScannerPage.prototype.testDeviceSelected = function () {
        var _this = this;
        var devvy = { id: 'C6:50:3F:C2:27:DB', name: 'testName', RSSI: -86 };
        this.ngZone.run(function () {
            console.log(JSON.stringify(devvy) + ' selected');
            _this.deviceService.setDevice(devvy);
            _this.router.navigateByUrl('/home/clouds', { queryParams: { device: JSON.stringify(devvy) } });
        });
    };
    ScannerPage.prototype.setStatus = function (message) {
        var _this = this;
        this.ngZone.run(function () {
            console.log(message);
            _this.statusMessage = message;
        });
    };
    ScannerPage.prototype.showAlert = function (title, message) {
        // let alert = this.alertCtrl.create({
        //   title: title,
        //   subTitle: message,
        //   buttons: ['OK']
        // });
        // alert.present();
    };
    ScannerPage = tslib_1.__decorate([
        Component({
            selector: 'app-scanner',
            templateUrl: './scanner.page.html',
            styleUrls: ['./scanner.page.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [BLE
            // , private alertCtrl: AlertController,
            ,
            NgZone,
            DeviceService,
            Router,
            ActivatedRoute,
            ScannerService])
    ], ScannerPage);
    return ScannerPage;
}());
export { ScannerPage };
//# sourceMappingURL=scanner.page.js.map