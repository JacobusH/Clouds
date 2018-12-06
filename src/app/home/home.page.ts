import { Component, OnInit, NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { DeviceService } from '../modules/shared/services/device.service';
import { Router } from '@angular/router';
// import { AlertController } from 'ionic-angular';

const NEOPIXEL_SERVICE = 'ccc0';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  devices: any[] = [];
  statusMessage: string;
  displayMessage:string = "Hallo";
  logMessage:string = "No device selected";

  triggerTemplate;
  isCollapsed = false;
  deferredPrompt;

  constructor(private ble: BLE
              // , private alertCtrl: AlertController,
              , private ngZone: NgZone
              , private deviceService: DeviceService
              , private router: Router) { 
  }
  
  ngOnInit() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
    });
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

  scan() {
    this.ngZone.run(() => {
      // this.ble.scan([], 60).subscribe(
        this.devices = [];  // clear existing list
        this.displayMsg("in scanning mode");
        this.ble.scan([], 4).subscribe(
          device => {
            let msg:string = "Found device: " + JSON.stringify(device);
            // this.displayMsg(msg);
            this.onDiscoveredDevice(device);
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

      this.router.navigateByUrl('/clouds', { queryParams: { device: JSON.stringify(device) }} )
    })
  }

  testDeviceSelected() {
    let devvy = { id: 'C6:50:3F:C2:27:DB', name: 'testName', RSSI: -86}

    this.ngZone.run(() => {
      console.log(JSON.stringify(devvy) + ' selected');
      this.deviceService.setDevice(devvy);

      this.router.navigateByUrl('/clouds', { queryParams: { device: JSON.stringify(devvy) }} )
    })
  }


  setStatus(message) {
    this.ngZone.run(() => {
      console.log(message);
      this.statusMessage = message;
    });
  } 

  showAlert(title, message) {
    // let alert = this.alertCtrl.create({
    //   title: title,
    //   subTitle: message,
    //   buttons: ['OK']
    // });
    // alert.present();
  }
}
