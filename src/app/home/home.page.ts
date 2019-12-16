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

  // cloudsDeviceID = "C6:50:3F:C2:27:DB"; // Jeanne's
  cloudsDeviceID = "EC:73:E7:89:67:01"; // mine

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
      // console.log('connect', x)
    })

    this.pageViewService.isVisible$.subscribe(x => {
      // console.log('vissy', x)
      this.isWindowOpen = x;
    })

    this.patternService.beginColor();
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
          // console.log('User accepted the A2HS prompt');
        } else {
          // console.log('User dismissed the A2HS prompt');
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
      // console.log(message);
      this.statusMessage = message;
    });
  } 

  changeBrightness(brightness: number) {
    this.patternService.setBrightness(brightness);
    // console.log('home brightness', brightness);
  }

  togglePageView(val: boolean) {
    if(val) {
      this.pageViewService.setVisibleTrue();
    }
    else {
      this.pageViewService.setVisibleFalse();
    }
  }

  resetColors() {
    this.patternService.beginColor();
  }

  /////////
  // POWER STUFF
  /////////
  onTap(event) {
    console.log("tapped")
    this.scannerService.setShowSettingsFalse();
    this.router.navigateByUrl('/home/scanner', { queryParams: { 'isShort': 'true' }} )
    // this.isWindowOpen = true;
  }

  onPress(event) {
    // console.log("held")
    this.scannerService.setShowSettingsTrue();
    this.router.navigateByUrl('/home/scanner', { queryParams: { 'isShort': 'false' }} )
    // this.isWindowOpen = true;
  }

  flipPower(flipTo: string) {
    if(flipTo == 'off') {
      this.patternService.sendPattern(0, 'Z', 10);
    }
    else { // to 'on'
      this.patternService.sendPattern(0, 'Y', 100);
    }
  }

  getPowerWidth() {
    // console.log(window.innerWidth);
    return "25%";
  }

  getOneBottom() {
    if(window.innerWidth < 400) {
      return "56px";
    }
    else {
      return "280px";
    }
  }
  getOneLeft() {
    if(window.innerWidth < 400) {
      return "280px";
    }
    else {
      return "150px";
    }
  }
  getTwoBottom() {
    if(window.innerWidth < 400) {
      return "71px";
    }
    else {
      return "150px";
    }
  }
  getTwoLeft() {
    if(window.innerWidth < 400) {
      return "309px";
    }
    else {
      return "150px";
    }
  }
  getThreeBottom() {
    if(window.innerWidth < 400) {
      return "49px";
    }
    else {
      return "150px";
    }
  }
  getThreeLeft() {
    if(window.innerWidth < 400) {
      return "327px";
    }
    else {
      return "150px";
    }
  }

  ///////////
  // SCANNER STUFF
  ///////////
  scan(auto: boolean) {
    this.ngZone.run(() => {
      // this.ble.scan([], 60).subscribe(
        this.devices = [];  // clear existing list
        this.displayMsg("in scanning mode");
        this.ble.scan([], 6).subscribe(
          device => {
            this.displayMsg("Found device: " + JSON.stringify(device));
            this.onDiscoveredDevice(device);

            // NOTE: use this for auto connect
            if(auto && device.id == this.cloudsDeviceID) {
              this.deviceSelected(device);
            }

          },
          err => {
            this.displayMsg("Error occurred during BLE scan: " + JSON.stringify(err));
            console.log("Error occurred during BLE scan: " + JSON.stringify(err));
          },
          () => {
            this.displayMsg("End of devices...");
            console.log("End of devices…");
        }
      );
    })
    
    console.log('Scanning for Bluetooth LE Devices');
  }

  onDiscoveredDevice(device) {
    console.log('Discovered ' + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
        this.displayMsg('Discovered ' + JSON.stringify(device, null, 2));
        this.devices.push(device);
    });
  }

  deviceSelected(device) {
    this.ngZone.run(() => {
      console.log(JSON.stringify(device) + ' selected');
      this.logMessage = "Device Selected: ";
      this.deviceService.setDevice(device);

      this.ble.connect(this.deviceService.selectedDevice.id).subscribe(
        peripheral => this.onConnected(peripheral),
        peripheral => this.onDeviceDisconnected(peripheral)
      )

      this.router.navigateByUrl('/home/clouds', { queryParams: { device: JSON.stringify(device) }} )
    })
  }

  onConnected(peripheral) {
    this.ngZone.run(() => {
      // this.connected = true;
      this.deviceService.setConnectedTrue();
      this.deviceService.setPeripheral(peripheral);
      // this.displayMsg = 'Connected to: ' + peripheral.name + ' ' + peripheral.id;

      // this.otherInfo = "service: " + this.deviceService.serviceCloud1 + "tx: " + this.deviceService.txCloud1;

      this.ble.startNotification(peripheral.id, this.deviceService.serviceCloud1, this.deviceService.rxCloud1).subscribe(
        buffer => {
          var data = new Uint8Array(buffer);
          console.log('Received Notification: Power Switch = ' + data);
          this.ngZone.run(() => {
            // this.displayMsg = "started notifs";
            // this.power = data[0] !== 0;
          });
        }
      );
    });
  }

  onDeviceDisconnected(peripheral) {
    this.deviceService.setConnectedFalse();
    // let toast = this.toastCtrl.create({
    //   message: 'The peripheral unexpectedly disconnected',
    //   duration: 3000,
    //   position: 'center'
    // });

    // toast.onDidDismiss(() => {
    //   console.log('Dismissed toast');
    //   // TODO navigate back?
    // });

    // toast.present();
  }

  

}
