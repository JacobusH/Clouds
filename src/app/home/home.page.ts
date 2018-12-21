import { Component, OnInit, NgZone, ElementRef, ViewChild } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { DeviceService } from '../modules/shared/services/device.service';
import { Router } from '@angular/router';
import { trigger, transition, useAnimation } from '@angular/animations';
import { PatternsService } from '../modules/shared/services/patterns.service';
import { bounce, pulse, fadeOutRight } from 'ng-animate';

const NEOPIXEL_SERVICE = 'ccc0';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: [
    trigger('pulse', [transition('* => *', useAnimation(fadeOutRight, {
      // Set the duration to 5seconds and delay to 2seconds
      // params: { timing: 5, delay: 2 }
    }))])
  ]
})
export class HomePage implements OnInit {
  devices: any[] = [];
  statusMessage: string;
  displayMessage:string = "Hallo";
  logMessage:string = "No device selected";
  isConnected;

  triggerTemplate;
  isCollapsed = false;
  deferredPrompt;

  constructor(private ble: BLE
              , private ngZone: NgZone
              , private deviceService: DeviceService
              , private router: Router
              , private patternService: PatternsService) { 
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
      console.log('connect', x)
    })
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
}
