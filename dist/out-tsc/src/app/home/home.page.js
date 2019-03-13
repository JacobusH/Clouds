import * as tslib_1 from "tslib";
import { Component, NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { DeviceService } from '../modules/shared/services/device.service';
import { Router } from '@angular/router';
import { trigger, transition, useAnimation } from '@angular/animations';
import { PatternsService } from '../modules/shared/services/patterns.service';
import { ScannerService } from '../modules/shared/services/scanner.service';
import { fadeOutRight } from 'ng-animate';
import { routeAnimations } from '../animations/routes.animation';
// import { Keyboard } from 'ionic-angular';
var NEOPIXEL_SERVICE = 'ccc0';
var HomePage = /** @class */ (function () {
    function HomePage(ble, ngZone, deviceService, router, patternService, scannerService) {
        this.ble = ble;
        this.ngZone = ngZone;
        this.deviceService = deviceService;
        this.router = router;
        this.patternService = patternService;
        this.scannerService = scannerService;
        this.debugMode = false;
        this.debugMsg = 'ahh';
        this.devices = [];
        this.displayMessage = "Hallo";
        this.logMessage = "No device selected";
        this.isOn = true;
        this.isCollapsed = false;
    }
    HomePage.prototype.ngOnInit = function () {
        var _this = this;
        window.addEventListener('beforeinstallprompt', function (e) {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            _this.deferredPrompt = e;
        });
        this.deviceService.isConnected$.subscribe(function (x) {
            _this.isConnected = x;
            _this.isOn = x;
            console.log('connect', x);
        });
    };
    HomePage.prototype.prepareRoute = function (outlet) {
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
    };
    HomePage.prototype.installPWA = function () {
        var _this = this;
        this.deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        this.deferredPrompt.userChoice
            .then(function (choiceResult) {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            }
            else {
                console.log('User dismissed the A2HS prompt');
            }
            _this.deferredPrompt = null;
        });
    };
    HomePage.prototype.displayMsg = function (msg) {
        var _this = this;
        this.ngZone.run(function () {
            _this.displayMessage = msg;
        });
    };
    HomePage.prototype.setStatus = function (message) {
        var _this = this;
        this.ngZone.run(function () {
            console.log(message);
            _this.statusMessage = message;
        });
    };
    HomePage.prototype.changeBrightness = function (brightness) {
        this.patternService.setBrightness(brightness);
        console.log('home brightness', brightness);
    };
    HomePage.prototype.flipPower = function (flipTo) {
        if (flipTo == 'off') {
            this.patternService.sendPattern(0, 'Z', 10);
        }
        else { // to 'on'
            this.patternService.sendPattern(0, 'Y', 100);
        }
    };
    HomePage.prototype.onTap = function (event) {
        console.log("tapped");
        this.debugMsg = 'tapped';
        this.scannerService.setShowSettingsFalse();
        this.router.navigateByUrl('/home/scanner', { queryParams: { 'isShort': 'true' } });
    };
    HomePage.prototype.onPress = function (event) {
        console.log("held");
        this.debugMsg = 'held';
        this.scannerService.setShowSettingsTrue();
        this.router.navigateByUrl('/home/scanner', { queryParams: { 'isShort': 'false' } });
    };
    HomePage = tslib_1.__decorate([
        Component({
            selector: 'app-home',
            templateUrl: 'home.page.html',
            styleUrls: ['home.page.scss'],
            animations: [
                routeAnimations,
                trigger('pulse', [transition('* => *', useAnimation(fadeOutRight, {
                    // Set the duration to 5seconds and delay to 2seconds
                    // params: { timing: 5, delay: 2 }
                    }))])
            ]
        }),
        tslib_1.__metadata("design:paramtypes", [BLE,
            NgZone,
            DeviceService,
            Router,
            PatternsService,
            ScannerService])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.page.js.map