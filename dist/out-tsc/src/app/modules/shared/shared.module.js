import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FlowersComponent } from './components/flowers/flowers.component';
import { SunMoonComponent } from './components/sun-moon/sun-moon.component';
var SharedModule = /** @class */ (function () {
    function SharedModule() {
    }
    SharedModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                DragDropModule
            ],
            declarations: [
                HeaderComponent,
                FlowersComponent,
                SunMoonComponent
            ],
            exports: [
                HeaderComponent,
                FlowersComponent,
                SunMoonComponent
            ]
        })
    ], SharedModule);
    return SharedModule;
}());
export { SharedModule };
//# sourceMappingURL=shared.module.js.map