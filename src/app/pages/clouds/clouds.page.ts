import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { DeviceService } from 'src/app/services/device.service';
import { Router, ActivatedRoute } from '@angular/router';



// const NEOPIXEL_SERVICE = '1800';
// const POWER_SWITCH = '2a00';
// const COLOR = '2a01';
// const BRIGHTNESS = '2a01';

@Component({
  selector: 'app-clouds',
  templateUrl: './clouds.page.html',
  styleUrls: ['./clouds.page.scss'],
})
export class CloudsPage implements OnInit, OnDestroy {
  // NeoPixel Service UUIDs
  NEOPIXEL_SERVICE = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
  NEOPIXEL_TX = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'; // Write, Write w/o resp
  NEOPIXEL_RX = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
  // COLOR = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
  // BRIGHTNESS = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
  // POWER_SWITCH = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';

  SERVICE_1800 = '1800';
  CHARAC_2a00 = '2a00'; // Read, Write
  CHARAC_2a01 = '2a01'; // Read
  CHARAC_2a04 = '2a04'; // Read
  
  SERVICE_1801 = '1801';
  CHARAC_2a05 = '2a05'; // Indicate

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
  power2: boolean = false;

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

  trySendA() {
    this.ngZone.run(() => {
      let data = new Uint8Array([0x41]); // A
      this.ble.write(this.peripheral.id, this.NEOPIXEL_SERVICE, this.NEOPIXEL_TX, data.buffer as ArrayBuffer).then(
        (info) => {
          this.displayMsg = 'Tried to send A... (info): ' + info; 
        },
        (err) => {
          this.displayMsg = 'Error sending A' + err; 
        }
      );
    })
  }

  onConnected(peripheral) {
    this.ngZone.run(() => {
      this.peripheral = peripheral;
      this.displayMsg = 'Connected to: ' + peripheral.name + ' ' + peripheral.id;
      
      this.peripheralInfo = JSON.stringify(peripheral) // show as JSON
      this.piServices = this.peripheral['services']
      this.piCharacs = this.peripheral['characteristics']

      // setup the neopixel rings
      let data = new Uint8Array([0x53]); // S
      this.ble.write(this.peripheral.id, this.NEOPIXEL_SERVICE, this.NEOPIXEL_TX, data.buffer as ArrayBuffer).then(
        (info) => {
          this.displayMsg = "Setting up Clouds | info: " + info
        },
        (err) => {
          this.displayMsg = "Err Setting up Clouds | err: " + err
        }
      )
      
      // test
      this.ble.startNotification(this.peripheral.id, this.NEOPIXEL_SERVICE, this.NEOPIXEL_RX).subscribe(
        buffer => {        
          var data = new Uint8Array(buffer);
          this.ngZone.run(() => {
            this.notifMsg = 'Received Notification: Data: ' + data
          })
        }
      )

      // get the current values so we can sync the UI
      this.ble.read(peripheral.id, this.NEOPIXEL_SERVICE, this.NEOPIXEL_RX).then(
        buffer => {
          var data = new Uint8Array(buffer);
          this.notifMsg = "red: " + data[0] + " | green: " + data[1] + " blue: " + data[2];
          this.red = data[0];
          this.green = data[1];
          this.blue = data[2];
        },
      );

      this.ble.read(peripheral.id, this.NEOPIXEL_SERVICE, this.NEOPIXEL_RX).then(
        buffer => {        
          var data = new Uint8Array(buffer);
          this.notifMsg = "brightness: " + data[0]
          this.brightness = data[0];
        }
      );

      this.ble.read(peripheral.id, this.NEOPIXEL_SERVICE, this.NEOPIXEL_RX).then(
        buffer => {
          var data = new Uint8Array(buffer);
          this.notifMsg = 'Received Notification: Power Switch: ' + data[0];
          this.power = data[0] !== 0;
        }
      );

      // TODO read and notification should use the same handler
      this.ble.startNotification(peripheral.id, this.NEOPIXEL_SERVICE, this.NEOPIXEL_RX).subscribe(
        buffer => {
          var data = new Uint8Array(buffer);
          this.notifMsg = 'Received Notification: Power Switch: ' + data;
          this.power = data[0] !== 0;
        }
      );

      // this.ble.startNotification(peripheral.id, NEOPIXEL_SERVICE, BRIGHTNESS).subscribe(
      //   buffer => {        
      //     var data = new Uint8Array(buffer);
      //     console.log('Received Notification: Brightness = ' + data[0]);
      //     this.ngZone.run(() => {
      //       this.brightness = data[0];
      //     });
      //   }
      // );
      
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

  trySendMsg() {
    this.ngZone.run(() => {
      this.displayMsg = 'Sending Msg'; 

      let data = new Uint8Array([0x41]);
      this.ble.write(this.peripheral.id, this.NEOPIXEL_SERVICE, this.NEOPIXEL_TX, data.buffer as ArrayBuffer).then(
        (info) => {
          console.log('Updated color')
          this.displayMsg = 'Updated color' + info; 
        },
        (err) => {
          this.displayMsg = 'Error updating color' + err; 
          console.log('Error updating color')
        }
      );
    })
  }

  setColor(event){
    this.ngZone.run(() => {
      this.displayMsg = 'Setting Color'; 
      let data = new Uint8Array([this.red, this.green, this.blue]);

      this.ble.write(this.peripheral.id, this.NEOPIXEL_SERVICE, this.NEOPIXEL_TX, data.buffer as ArrayBuffer).then(
        (info) => {
          console.log('Updated color')
          this.displayMsg = 'Updated color' + info; 
        },
        (err) => {
          this.displayMsg = 'Error updating color' + err; 
          console.log('Error updating color')
        }
      );
    })
  }

  setBrightness(event){
    this.ngZone.run(() => {
      let data = new Uint8Array([this.brightness]);
      this.ble.write(this.peripheral.id, this.NEOPIXEL_SERVICE, this.NEOPIXEL_TX, data.buffer as ArrayBuffer).then(
        (info) => {
          this.displayMsg = 'Updated brightness' + info; 
          console.log('Updated brightness')
        },
        (err) => {
          this.displayMsg = 'Error updating brightness' + err; 
          console.log('Error updating brightness')
        }
      );
    })
  }

  onPowerSwitchChange(event) {
    this.ngZone.run(() => {
      let value = this.power ? 1 : 0;
      let data = new Uint8Array([value]);
      this.displayMsg = 'Power Switch Property ' + this.power;
      console.log('Power Switch Property ' + this.power);

      this.ble.write(this.peripheral.id, this.NEOPIXEL_SERVICE, this.NEOPIXEL_TX, data.buffer as ArrayBuffer).then(
        (msg) => {
          console.log('Updated power switch')
          this.displayMsg = "Updated Power switch " + msg
          if (this.power && this.brightness === 0) {
            this.brightness = 0x3f; // cheating, should rely on notification
          }
        },
        (err) => {
          this.displayMsg = "Error updating power switch: " + err
          console.log('Error updating  power switch')
        }
      );
    })
  }

  
}
