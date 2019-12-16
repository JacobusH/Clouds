import * as tslib_1 from "tslib";
import { Component, NgZone } from '@angular/core';
import { interval } from 'rxjs';
import { grow, growSlowly } from '../../../../animations/grow.animation';
import { of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
var FlowersComponent = /** @class */ (function () {
    function FlowersComponent(ngZone) {
        this.ngZone = ngZone;
        this.flowers = [];
        this.trees = [];
        this.curflowerCount = 0;
        this.totalFlowers = 250;
        this.curTreeCount = 0;
        this.totalTreeCount = 0;
        this._list = [];
        this._observableList = new BehaviorSubject([]);
    }
    Object.defineProperty(FlowersComponent.prototype, "observableList", {
        get: function () { return this._observableList.asObservable(); },
        enumerable: true,
        configurable: true
    });
    FlowersComponent.prototype.addFlower = function (person) {
        this._list.push(person);
        this._observableList.next(this._list);
    };
    FlowersComponent.prototype.removeFlower = function () {
        // this._list.shift(); // remove first elem
        this._list[0] = {
            bottom: -1,
            index: 0,
            left: -1,
            width: 0
        };
        this._observableList.next(this._list);
    };
    FlowersComponent.prototype.ngOnInit = function () {
        var _this = this;
        var flower = { 'width': 0, 'bottom': 0, 'left': 0, 'index': 0 };
        var treeFlower = { 'width': 0, 'bottom': 0, 'left': 0, 'index': 0 };
        var upperBound = 54;
        var lowerBound = 15; // 140
        var rightBound = 100;
        var leftBound = 0;
        var left = -1;
        var bottom = -1;
        // let firstTree = {
        //   'width': 30
        //   , 'bottom': 45
        //   , 'left': 12
        //   , 'index': 300
        // }
        this.ngZone.run(function () {
            // this.trees.push(firstTree);
            var flowerMaker$ = interval(1000).subscribe(function (n) {
                left = _this.randomIntFromInterval(leftBound, rightBound);
                bottom = _this.randomIntFromInterval(lowerBound, upperBound);
                var width = _this.getWidth(bottom);
                width = (_this.curflowerCount % 5 == 1 || _this.curflowerCount % 5 == 3) ? width + 4 : width; // make rose bigger
                flower = {
                    'width': width,
                    'bottom': bottom,
                    'left': left,
                    'index': _this.getZIndex(bottom)
                };
                _this.flowers.push(flower);
                // this.addFlower(flower);
                // console.log(this._observableList)
                if (_this.curflowerCount >= _this.totalFlowers) {
                    flowerMaker$.unsubscribe();
                    // this.removeFlower();
                    // this.flowers.reverse().pop;
                }
                else {
                    _this.curflowerCount++;
                }
                // console.log(`It's been ${n} seconds since subscribing!`)
            });
            var treeMaker$ = interval(60000).subscribe(function (n) {
                lowerBound = 37;
                upperBound = 45;
                left = _this.randomIntFromInterval(leftBound, rightBound);
                bottom = _this.randomIntFromInterval(lowerBound, upperBound);
                var width = _this.getWidth(bottom);
                // width = (this.curflowerCount % 5 == 1 || this.curflowerCount % 5 == 3) ? width + 4 : width; // make tree bigger
                width = width + 20;
                treeFlower = {
                    'width': width,
                    'bottom': bottom,
                    'left': left,
                    'index': _this.getZIndex(bottom)
                };
                // this.trees.push(treeFlower);
                _this.curTreeCount++;
                if (_this.curTreeCount >= _this.totalTreeCount) {
                    treeMaker$.unsubscribe();
                }
            });
        });
    };
    FlowersComponent.prototype.ngAfterViewInit = function () {
        // let flowers = document.getElementsByClassName("flower");   
        // TweenLite.to(flowers, 2, {width:"50px", height:"300px"});
    };
    FlowersComponent.prototype.setFlowerStyles = function (width, bottom, left, zIndex) {
        var styles = {};
        styles['position'] = 'absolute';
        styles['width'] = width + '%';
        styles['left'] = left + '%';
        styles['bottom'] = bottom + '%';
        styles['z-index'] = zIndex;
        return styles;
    };
    FlowersComponent.prototype.getWidth = function (bottom) {
        if (bottom < 10) {
            return 8;
        }
        else if (bottom < 20) {
            return 7;
        }
        else if (bottom < 30) {
            return 6;
        }
        else if (bottom < 40) {
            return 5;
        }
        else if (bottom <= 50) {
            return 4;
        }
        else {
            return 3;
        }
    };
    FlowersComponent.prototype.getZIndex = function (bottom) {
        return Math.floor((1 / bottom) * 9000);
    };
    FlowersComponent.prototype.randomIntFromInterval = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    FlowersComponent.prototype.trackElement = function (index, element) {
        return element ? element.left : null;
    };
    FlowersComponent = tslib_1.__decorate([
        Component({
            selector: 'app-flowers',
            templateUrl: './flowers.component.html',
            styleUrls: ['./flowers.component.scss'],
            animations: [grow, growSlowly]
        }),
        tslib_1.__metadata("design:paramtypes", [NgZone])
    ], FlowersComponent);
    return FlowersComponent;
}());
export { FlowersComponent };
//# sourceMappingURL=flowers.component.js.map