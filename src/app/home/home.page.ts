import { Component, OnInit, NgZone, ElementRef, ViewChild, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BLE } from '@ionic-native/ble/ngx';
import { DeviceService } from '../services/device.service';
import { Router } from '@angular/router';
import { trigger, transition, useAnimation } from '@angular/animations';
import { PatternsService } from '../services/patterns.service';
import { PageViewService } from '../services/page-view.service';
import { ScannerService } from '../services/scanner.service';
import { bounce, pulse, fadeOutRight } from 'ng-animate';
import { routeAnimations } from '../animations/routes.animation';
// import { Keyboard } from 'ionic-angular';

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
  innerWidth: any;
  isOn = true;
  isCloudVisible = true;
  isWindowOpen = false;

  triggerTemplate;
  isCollapsed = false;
  deferredPrompt;

  constructor(private ble: BLE
              , private ngZone: NgZone
              , private deviceService: DeviceService
              , private router: Router
              , private patternService: PatternsService
              , private scannerService: ScannerService
              , private pageViewService: PageViewService) { 
  }
  
  ngOnInit() {
    this.innerWidth = window.innerWidth;
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

    this.pageViewService.isVisible$.subscribe(x => {
      console.log('vissy', x)
      this.isWindowOpen = x;
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

  

  

  

  

  


}
