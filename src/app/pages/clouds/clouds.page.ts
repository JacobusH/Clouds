import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { DeviceService } from '../../modules/shared/services/device.service';
import { PatternsService } from '../../modules/shared/services/patterns.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PatternsEnum } from '../../modules/shared/models/patterns.model';

@Component({
  selector: 'app-clouds',
  templateUrl: './clouds.page.html',
  styleUrls: ['./clouds.page.scss'],
})
export class CloudsPage implements OnInit, OnDestroy {
  serviceDevice;
  connected = false;

  displayMsg;
  notifMsg;
  otherInfo;

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
              , private actRoute: ActivatedRoute
              , private patternService: PatternsService) {

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

  sendCmd(letter: string) {
    // this.patternService.sendCommand(letter).then(
    //   (info) => {
    //     this.displayMsg = 'Sent cmd' + letter + " | info: " + info; 
    //   },
    //   (err) => {
    //     this.displayMsg = 'Err sending cmd' + letter + " | err: " + err; 
    //   }
    // )

    let data : Uint8Array;
    data = new Uint8Array([0x41]); // A
    return this.ble.write(this.deviceService.peripheral.id, this.deviceService.serviceCloud1, this.deviceService.txCloud1, data.buffer as ArrayBuffer).then(
      (info) => {
        this.displayMsg = 'Sent cmd' + letter + " | info: " + info; 
      },
      (err) => {
        this.displayMsg = 'Err sending cmd' + letter + " | err: " + err; 
      }
    )
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
      this.connected = true;
      this.deviceService.setPeripheral(peripheral);
      this.displayMsg = 'Connected to: ' + peripheral.name + ' ' + peripheral.id;

      this.otherInfo = "service: " + this.deviceService.serviceCloud1 + "tx: " + this.deviceService.txCloud1;

      this.ble.startNotification(peripheral.id, this.deviceService.serviceCloud1, this.deviceService.rxCloud1).subscribe(
        buffer => {
          var data = new Uint8Array(buffer);
          console.log('Received Notification: Power Switch = ' + data);
          this.ngZone.run(() => {
            this.displayMsg = "started notifs";
            this.power = data[0] !== 0;
          });
        }
      );
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
