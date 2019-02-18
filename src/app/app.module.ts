import { NgModule } from '@angular/core';
import { DragDropModule  } from '@angular/cdk/drag-drop';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { IonicStorageModule } from '@ionic/storage';
// import { CustomReuseStrategy } from './home/route-reuse-strategy';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular'; 
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BLE } from '@ionic-native/ble/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
// import { Camera } from '@ionic-native/camera';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { ServiceWorkerModule } from '@angular/service-worker';

import { environment } from '../environments/environment';


registerLocaleData(en);
// import { AlertController } from 'ionic-angular';

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule
    , AngularFirestoreModule
    , AngularFireStorageModule
    , AngularFireModule.initializeApp(environment.firebase)
    , DragDropModule
    , IonicModule.forRoot()
    , IonicStorageModule.forRoot()
    , AppRoutingModule
    , BrowserAnimationsModule
    , FormsModule
    , HttpClientModule
    , ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BLE,
    Keyboard,
    // AlertController,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // , { provide: RouteReuseStrategy, useClass: CustomReuseStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
