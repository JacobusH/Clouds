import { Component, OnInit, NgZone, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BLE } from '@ionic-native/ble/ngx';
import { DeviceService } from '../modules/shared/services/device.service';
import { Router } from '@angular/router';
import { trigger, transition, useAnimation } from '@angular/animations';
import { PatternsService } from '../modules/shared/services/patterns.service';
import { ScannerService } from '../modules/shared/services/scanner.service';
import { bounce, pulse, fadeOutRight } from 'ng-animate';
import { routeAnimations } from '../animations/routes.animation';
// import { Keyboard } from 'ionic-angular';

const NEOPIXEL_SERVICE = 'ccc0';

@Component({
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
})
export class HomePage implements OnInit {
  debugMode = false;
  debugMsg = 'ahh';
  devices: any[] = [];
  statusMessage: string;
  displayMessage:string = "Hallo";
  logMessage:string = "No device selected";
  isConnected;
  isOn = true;

  triggerTemplate;
  isCollapsed = false;
  deferredPrompt;

  constructor(private ble: BLE
              , private ngZone: NgZone
              , private deviceService: DeviceService
              , private router: Router
              , private patternService: PatternsService
              , private scannerService: ScannerService) { 
  }
  
  ngOnInit() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
    });

    this.deviceService.isConnected$.subscribe(x => {
      this.isConnected = x;
      this.isOn = x;
      console.log('connect', x)
    })
  } 

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }


  installPWA() {
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        this.deferredPrompt = null;
      });
  }

  displayMsg(msg: string) {
    this.ngZone.run(() => {
      this.displayMessage = msg;
    })
  }

  setStatus(message) {
    this.ngZone.run(() => {
      console.log(message);
      this.statusMessage = message;
    });
  } 

  changeBrightness(brightness: number) {
    this.patternService.setBrightness(brightness);
    console.log('home brightness', brightness);
  }

  flipPower(flipTo: string) {
    if(flipTo == 'off') {
      this.patternService.sendPattern(0, 'Z', 10);
    }
    else { // to 'on'
      this.patternService.sendPattern(0, 'Y', 100);
    }
  }

  onTap(event) {
    console.log("tapped")
    this.debugMsg = 'tapped';
    this.scannerService.setShowSettingsFalse();
    this.router.navigateByUrl('/home/scanner', { queryParams: { 'isShort': 'true' }} )
  }

  onPress(event) {
    console.log("held")
    this.debugMsg = 'held';
    this.scannerService.setShowSettingsTrue();
    this.router.navigateByUrl('/home/scanner', { queryParams: { 'isShort': 'false' }} )
  }


}
