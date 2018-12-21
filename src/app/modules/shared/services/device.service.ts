import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { BLE } from '@ionic-native/ble/ngx';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  public bhSub = new BehaviorSubject<boolean>(false);
  isConnected$ = this.bhSub.asObservable();

  selectedDevice: any;
  peripheral: any;
  peripheralInfo: any;
  piServices;
  piCharacs;

  // NeoPixel Service UUIDs
  serviceCloud1 = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
  txCloud1 = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'; // Write, Write w/o resp
  rxCloud1 = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
  service1800 = '1800';
  CHARAC_2a00 = '2a00'; // Read, Write
  CHARAC_2a01 = '2a01'; // Read
  CHARAC_2a04 = '2a04'; // Read
  
  service1801 = '1801';
  CHARAC_2a05 = '2a05'; // Indicate
  
  constructor(private ble: BLE) { 

  }
  
  toggleState(){
    this.bhSub.next(!this.bhSub.value);
  }
  
  setConnectedFalse(){
    this.bhSub.next(false);
  }

  setConnectedTrue(){
    this.bhSub.next(true);
  }

  setDevice(device: any) {
    this.selectedDevice = device;
  }

  setPeripheral(peripheral: any) {
    this.peripheral = peripheral;
    this.peripheralInfo = JSON.stringify(peripheral) // show as JSON
    this.piServices = this.peripheral['services']
    this.piCharacs = this.peripheral['characteristics']

    // setup the neopixel rings
    let data = new Uint8Array([0x53]); // S
    this.ble.write(this.peripheral.id, this.serviceCloud1, this.txCloud1, data.buffer as ArrayBuffer)
  }

 // // get the current values so we can sync the UI
  // this.ble.read(peripheral.id, this.NEOPIXEL_SERVICE, this.NEOPIXEL_RX).then(
  //   buffer => {
  //     var data = new Uint8Array(buffer);
  //     this.notifMsg = "red: " + data[0] + " | green: " + data[1] + " blue: " + data[2];
  //     this.red = data[0];
  //     this.green = data[1];
  //     this.blue = data[2];
  //   },
  // );

  // this.ble.read(peripheral.id, this.NEOPIXEL_SERVICE, this.NEOPIXEL_RX).then(
  //   buffer => {        
  //     var data = new Uint8Array(buffer);
  //     this.notifMsg = "brightness: " + data[0]
  //     this.brightness = data[0];
  //   }
  // );

  // this.ble.read(peripheral.id, this.NEOPIXEL_SERVICE, this.NEOPIXEL_RX).then(
  //   buffer => {
  //     var data = new Uint8Array(buffer);
  //     this.notifMsg = 'Received Notification: Power Switch: ' + data[0];
  //     this.power = data[0] !== 0;
  //   }
  // );

  // // TODO read and notification should use the same handler
  // this.ble.startNotification(peripheral.id, this.NEOPIXEL_SERVICE, this.NEOPIXEL_RX).subscribe(
  //   buffer => {
  //     var data = new Uint8Array(buffer);
  //     this.notifMsg = 'Received Notification: Power Switch: ' + data;
  //     this.power = data[0] !== 0;
  //   }
  // );
 

}
