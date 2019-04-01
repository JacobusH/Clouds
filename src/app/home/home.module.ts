import { NgModule } from '@angular/core';
import { DragDropModule  } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouteReuseStrategy } from '@angular/router';
import { BLE } from '@ionic-native/ble/ngx';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
 
import { HomePage } from './home.page';
import { CloudsPage } from '../pages/clouds/clouds.page';
import { ScannerPage } from '../pages/scanner/scanner.page';
import { OverviewPage } from '../pages/overview/overview.page';
import { SettingsPage } from '../pages/settings/settings.page';

import { routing } from './home.routing';
import { HomePowerComponent } from './home-power/home-power.component';
import { HomeHouseComponent } from './home-house/home-house.component';
import { HomeRainbowComponent } from './home-rainbow/home-rainbow.component';
import { HomeCloudsComponent } from './home-clouds/home-clouds.component';
import { HomeMountainsComponent } from './home-mountains/home-mountains.component';
import { HomeFlowersComponent } from './home-flowers/home-flowers.component';
import { HomeSunMoonComponent } from './home-sun-moon/home-sun-moon.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    HomePage
    , CloudsPage
    , ScannerPage
    , OverviewPage
    , SettingsPage
    , HomePowerComponent
    , HomeHouseComponent
    , HomeRainbowComponent
    , HomeCloudsComponent
    , HomeMountainsComponent
    , HomeFlowersComponent
    , HomeSunMoonComponent
  ],
  imports: [
    routing
    , CommonModule
    , DragDropModule
    , DragAndDropModule
    , FormsModule
    , IonicModule
    , PerfectScrollbarModule
    , RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  providers: [
    BLE
    , {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  // , AlertController
]
})
export class HomePageModule {}
