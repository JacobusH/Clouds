import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BLE } from '@ionic-native/ble/ngx';
import { NgZorroAntdModule, NZ_I18N, en_US, NzLayoutModule, NzCheckboxModule, NzPopoverModule } from 'ng-zorro-antd';


import { HomePage } from './home.page';
import { CloudsPage } from '../pages/clouds/clouds.page';
import { ScannerPage } from '../pages/scanner/scanner.page';
import { OverviewPage } from '../pages/overview/overview.page';

import { routing } from './home.routing';


@NgModule({
  declarations: [
    HomePage
    , CloudsPage
    , ScannerPage
    , OverviewPage
  ],
  imports: [
    routing
    , CommonModule
    , FormsModule
    , IonicModule
    , NgZorroAntdModule
    , RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  providers: [
    BLE
    , { provide: NZ_I18N, useValue: en_US }
  // , AlertController
]
})
export class HomePageModule {}
