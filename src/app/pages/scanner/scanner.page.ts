import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { DeviceService } from '../../modules/shared/services/device.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ScannerService } from '../../modules/shared/services/scanner.service';
import { switchMap } from 'rxjs/operators';
// import { AlertController } from 'ionic-angular';

const NEOPIXEL_SERVICE = 'ccc0';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss']
})
export class ScannerPage implements OnInit, AfterViewInit {
  clickManner$: Observable<any[]>;
  isShowSettings: Boolean;
  devices: any[] = [];
  statusMessage: string;
  displayMessage:string = "Hallo";
  logMessage:string = "No device selected";

  // cloudsDeviceID = "C6:50:3F:C2:27:DB"; // Jeanne's
  cloudsDeviceID = "EC:73:E7:89:67:01"; // mine

  constructor(private ble: BLE
              // , private alertCtrl: AlertController,
              , private ngZone: NgZone
              , private deviceService: DeviceService
              , private router: Router
              , private actRoute: ActivatedRoute
              , private scannerService: ScannerService) { 
  }
  
  ngOnInit() {
    // this.ngZone.run(() => {
    //   this.scannerService.isShowSettings$.subscribe(toShow => {
    //     if(toShow) {
    //       this.isShowSettings = true;
    //       this.scan(false); // scan and only show list, allow them to pick which to connect
    //     }
    //     else {
    //       this.isShowSettings = false;
    //       this.scan(true); // scan and connect to hardcoded device
    //     }
    //   })
    // })
  }

  ngAfterViewInit() {
    this.ngZone.run(() => {
      this.scannerService.isShowSettings$.subscribe(toShow => {
        if(toShow) {
          this.isShowSettings = true;
          this.scan(false); // scan and only show list, allow them to pick which to connect
        }
        else {
          this.isShowSettings = false;
          this.scan(true); // scan and connect to hardcoded device
        }
      })
    })
  }

  displayMsg(msg: string) {
    this.ngZone.run(() => {
      this.displayMessage = msg;
    })
  }

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

  testDeviceSelected() {
    let devvy = { id: 'C6:50:3F:C2:27:DB', name: 'testName', RSSI: -86}

    this.ngZone.run(() => {
      console.log(JSON.stringify(devvy) + ' selected');
      this.deviceService.setDevice(devvy);

      this.router.navigateByUrl('/home/clouds', { queryParams: { device: JSON.stringify(devvy) }} )
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
