import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BLE } from '@ionic-native/ble/ngx';
import { PatternsModule } from '../modules/patterns/patterns.module';
import { HomePage } from './home.page';
import { CloudsPage } from '../pages/clouds/clouds.page';
import { ScannerPage } from '../pages/scanner/scanner.page';
import { OverviewPage } from '../pages/overview/overview.page';
import { SettingsPage } from '../pages/settings/settings.page';
import { ColorPickerComponent } from '../pages/clouds/color-picker/color-picker.component';
import { PatternsComponent } from '../pages/clouds/patterns/patterns.component';
import { routing } from './home.routing';
var HomePageModule = /** @class */ (function () {
    function HomePageModule() {
    }
    HomePageModule = tslib_1.__decorate([
        NgModule({
            declarations: [
                HomePage,
                CloudsPage,
                ScannerPage,
                OverviewPage,
                ColorPickerComponent,
                PatternsComponent,
                SettingsPage
            ],
            imports: [
                routing,
                CommonModule,
                DragDropModule,
                FormsModule,
                IonicModule,
                PatternsModule,
                RouterModule.forChild([
                    {
                        path: '',
                        component: HomePage
                    }
                ])
            ],
            providers: [
                BLE,
                { provide: NZ_I18N, useValue: en_US }
                // , AlertController
            ]
        })
    ], HomePageModule);
    return HomePageModule;
}());
export { HomePageModule };
//# sourceMappingURL=home.module.js.map