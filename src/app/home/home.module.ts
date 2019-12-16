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
import { ResizableModule } from 'angular-resizable-element';
import { ColorAlphaModule } from 'ngx-color/alpha'; // <color-alpha-picker></color-alpha-picker>
import { ColorBlockModule } from 'ngx-color/block'; // <color-block></color-block>
import { ColorChromeModule } from 'ngx-color/chrome'; // <color-chrome></color-chrome>
import { ColorCircleModule } from 'ngx-color/circle'; // <color-circle></color-circle>
import { ColorCompactModule } from 'ngx-color/compact'; // <color-compact></color-compact>
import { ColorGithubModule } from 'ngx-color/github'; // <color-github></color-github>
import { ColorHueModule } from 'ngx-color/hue'; // <color-hue-picker></color-hue-picker>
import { ColorMaterialModule } from 'ngx-color/material'; // <color-material></color-material>
import { ColorPhotoshopModule } from 'ngx-color/photoshop'; // <color-photoshop></color-photoshop>
import { ColorSketchModule } from 'ngx-color/sketch'; // <color-sketch></color-sketch>
import { ColorSliderModule } from 'ngx-color/slider'; // <color-slider></color-slider>
import { ColorSwatchesModule } from 'ngx-color/swatches'; // <color-swatches></color-swatches>
import { ColorTwitterModule } from 'ngx-color/twitter'; // <color-twitter></color-twitter>
 
import { HomePage } from './home.page';
import { ScannerPage } from '../pages/scanner/scanner.page';
import { OverviewPage } from '../pages/overview/overview.page';
import { SettingsPage } from '../pages/settings/settings.page';
import { CloudsPage } from '../pages/clouds/clouds.page';
import { PatternsComponent } from '../pages/clouds/patterns/patterns.component';
import { JetsteamComponent } from '../pages/clouds/jetsteam/jetsteam.component';
import { DragBoxComponent } from '../pages/clouds/patterns/drag-box/drag-box.component';

import { routing } from './home.routing';
import { HomePowerComponent } from './home-power/home-power.component';
import { HomeHouseComponent } from './home-house/home-house.component';
import { HomeRainbowComponent } from './home-rainbow/home-rainbow.component';
import { HomeCloudsComponent } from './home-clouds/home-clouds.component';
import { HomeMountainsComponent } from './home-mountains/home-mountains.component';
import { HomeFlowersComponent } from './home-flowers/home-flowers.component';
import { HomeSunMoonComponent } from './home-sun-moon/home-sun-moon.component';

import { StateCircleComponent } from '../pages/clouds/patterns/state-circle/state-circle.component';


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
    , JetsteamComponent
    , DragBoxComponent
    , StateCircleComponent
    , PatternsComponent
  ],
  imports: [
    routing
    , ColorSketchModule
    , ColorCircleModule
    , ColorPhotoshopModule



    , CommonModule
    , DragDropModule
    , DragAndDropModule
    , FormsModule
    , IonicModule
    , PerfectScrollbarModule
    , ResizableModule
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
