import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { DeviceService } from '../../modules/shared/services/device.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PatternsEnum } from '../../modules/shared/models/patterns.model';

@Component({
  selector: 'app-clouds',
  templateUrl: './clouds.page.html',
  styleUrls: ['./clouds.page.scss'],
})
export class CloudsPage implements OnInit, OnDestroy {
  serviceDevice;

  displayMsg;
  notifMsg;

  showPickers = false;
  showPerp = false;

  peripheral: any = {};
  red: number;
  green: number;
  blue: number;
  brightness: number;
  power: boolean;

  peripheralInfo;
  piServices;
  piCharacs;


  constructor(private ble: BLE,
              private ngZone: NgZone
              , private deviceService: DeviceService
              , private router: Router
              , private actRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.ngZone.run(() => {
      this.displayMsg = "Trying to connect to " + this.deviceService.selectedDevice.name;
      this.serviceDevice = JSON.stringify(this.deviceService.selectedDevice);

      this.ble.connect(this.deviceService.selectedDevice.id).subscribe(
        peripheral => this.onConnected(peripheral),
        peripheral => this.onDeviceDisconnected(peripheral)
      )
    })
  }

  ngOnDestroy() {
    console.log('destroying disconnecting Bluetooth');
    this.ble.disconnect(this.peripheral.id).then(
      () => console.log('Disconnected ' + JSON.stringify(this.peripheral)),
      () => console.log('ERROR disconnecting ' + JSON.stringify(this.peripheral))
    )
  }

  onConnected(peripheral) {
    this.ngZone.run(() => {
      this.deviceService.setPeripheral(peripheral);
      this.displayMsg = 'Connected to: ' + peripheral.name + ' ' + peripheral.id;
    });
  }

  onDeviceDisconnected(peripheral) {
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

  setColor(event){
    // this.ngZone.run(() => {
    //   this.displayMsg = 'Setting Color'; 
    //   let data = new Uint8Array([this.red, this.green, this.blue]);

    //   this.ble.write(this.peripheral.id, this.NEOPIXEL_SERVICE, this.NEOPIXEL_TX, data.buffer as ArrayBuffer).then(
    //     (info) => {
    //       console.log('Updated color')
    //       this.displayMsg = 'Updated color' + info; 
    //     },
    //     (err) => {
    //       this.displayMsg = 'Error updating color' + err; 
    //       console.log('Error updating color')
    //     }
    //   );
    // })
  }

  setBrightness(event){
    // this.ngZone.run(() => {
    //   let data = new Uint8Array([this.brightness]);
    //   this.ble.write(this.peripheral.id, this.NEOPIXEL_SERVICE, this.NEOPIXEL_TX, data.buffer as ArrayBuffer).then(
    //     (info) => {
    //       this.displayMsg = 'Updated brightness' + info; 
    //       console.log('Updated brightness')
    //     },
    //     (err) => {
    //       this.displayMsg = 'Error updating brightness' + err; 
    //       console.log('Error updating brightness')
    //     }
    //   );
    // })
  }

  onPowerSwitchChange(event) {
    // this.ngZone.run(() => {
    //   let value = this.power ? 1 : 0;
    //   let data = new Uint8Array([value]);
    //   this.displayMsg = 'Power Switch Property ' + this.power;
    //   console.log('Power Switch Property ' + this.power);

    //   this.ble.write(this.peripheral.id, this.NEOPIXEL_SERVICE, this.NEOPIXEL_TX, data.buffer as ArrayBuffer).then(
    //     (msg) => {
    //       console.log('Updated power switch')
    //       this.displayMsg = "Updated Power switch " + msg
    //       if (this.power && this.brightness === 0) {
    //         this.brightness = 0x3f; // cheating, should rely on notification
    //       }
    //     },
    //     (err) => {
    //       this.displayMsg = "Error updating power switch: " + err
    //       console.log('Error updating  power switch')
    //     }
    //   );
    // })
  }

  
}
