import * as tslib_1 from "tslib";
import { Component, ViewChild, ElementRef, EventEmitter, Output, NgZone } from '@angular/core';
var SunMoonComponent = /** @class */ (function () {
    function SunMoonComponent(ngZone) {
        this.ngZone = ngZone;
        this.brightness = new EventEmitter(); // 0 - 255
        this.sunOpacity = 1;
        this.moonOpacity = 0;
        this.curBrightness = 0;
        this.emitter = { 'min': 1, 'max': 255 };
    }
    SunMoonComponent.prototype.ngOnInit = function () {
    };
    SunMoonComponent.prototype.dragStarted = function (event) {
        console.log('dragStarted Event > item', event);
    };
    SunMoonComponent.prototype.dragEnded = function (event) {
        var coord = event.source.element.nativeElement.getBoundingClientRect();
        this.setSunMoonOpacity(coord.left, coord.right);
    };
    // dragMoved(event: CdkDragMove) {
    //   console.log(`> Position X: ${event.pointerPosition.x} - Y: ${event.pointerPosition.y}`);
    // }
    SunMoonComponent.prototype.setSunMoonOpacity = function (left, right) {
        var _this = this;
        this.ngZone.run(function () {
            var middle = (right + left) / 2;
            if (middle <= 0) {
                _this.sunOpacity = 1;
                _this.moonOpacity = 0;
            }
            else if (middle >= window.innerWidth) {
                _this.sunOpacity = 0;
                _this.moonOpacity = 1;
            }
            else { // in betwewen 
                var sunny = 1 - (middle / window.innerWidth);
                var moony = middle / window.innerWidth;
                _this.sunOpacity = sunny;
                _this.moonOpacity = moony;
            }
            // console.log('left, right, width', left, right, window.innerWidth )
            _this.calculateBrightness(_this.sunOpacity);
        });
    };
    SunMoonComponent.prototype.calculateBrightness = function (opacityVal) {
        var _this = this;
        var toEmit = 0;
        if (opacityVal <= 0) {
            toEmit = this.emitter.min;
        }
        else if (opacityVal >= 1) {
            toEmit = this.emitter.max;
        }
        else { // in between
            toEmit = Math.floor(opacityVal * 255);
        }
        this.brightness.emit(toEmit);
        console.log('emitted brightness', toEmit);
        this.ngZone.run(function () {
            _this.curBrightness = toEmit;
        });
    };
    tslib_1.__decorate([
        ViewChild('ElementRefName'),
        tslib_1.__metadata("design:type", ElementRef)
    ], SunMoonComponent.prototype, "element", void 0);
    tslib_1.__decorate([
        Output('brightness'),
        tslib_1.__metadata("design:type", EventEmitter)
    ], SunMoonComponent.prototype, "brightness", void 0);
    SunMoonComponent = tslib_1.__decorate([
        Component({
            selector: 'app-sun-moon',
            templateUrl: './sun-moon.component.html',
            styleUrls: ['./sun-moon.component.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [NgZone])
    ], SunMoonComponent);
    return SunMoonComponent;
}());
export { SunMoonComponent };
//# sourceMappingURL=sun-moon.component.js.map