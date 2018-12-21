import { Injectable } from '@angular/core';
import { PatternsEnum } from '../../../modules/shared/models/patterns.model';
import { BLE } from '@ionic-native/ble/ngx';
import { DeviceService } from './device.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class PatternsService {
  colPatters = '!Patterns';
 
  constructor(
    private ble: BLE 
    , private deviceService: DeviceService) { 
      
  }

  // Commands to send to controller
  sendCommand(cmd: string) {
    let data = new TextEncoder().encode(cmd);
    return this.ble.write(this.deviceService.peripheral.id, this.deviceService.serviceCloud1, this.deviceService.txCloud1, data.buffer as ArrayBuffer)
  }

  setBrightness(brightness: number) {
    console.log('setBrightness');
    let cmd = new Uint8Array([0x42, brightness]); // send B
    this.ble.write(this.deviceService.peripheral.id, this.deviceService.serviceCloud1, this.deviceService.txCloud1, cmd.buffer as ArrayBuffer).then(
      () => {
          console.log('Sent B');
        },
      () => console.log('Error updating brightness')
    );
  }

  sendPattern(cloudNum: number, pattLett: string, interval: number) {
    if(pattLett == 'A') { // RAINBOW_CYCLE
      let cmd = new Uint8Array([0x42, cloudNum, interval]); // send cloudNum, pattHex, timingInterval
      return this.ble.write(this.deviceService.peripheral.id, this.deviceService.serviceCloud1, this.deviceService.txCloud1, cmd.buffer as ArrayBuffer)
    }
    else if(pattLett == 'C') { // THEATER_CHASE
      let cmd = new Uint8Array([0x44, cloudNum, interval]); // send cloudNum, pattHex, timingInterval
      return this.ble.write(this.deviceService.peripheral.id, this.deviceService.serviceCloud1, this.deviceService.txCloud1, cmd.buffer as ArrayBuffer)
    }
    else if(pattLett == 'D') {  // COLOR_WIPE
      let cmd = new Uint8Array([0x45, cloudNum, interval]); // send cloudNum, pattHex, timingInterval
      return this.ble.write(this.deviceService.peripheral.id, this.deviceService.serviceCloud1, this.deviceService.txCloud1, cmd.buffer as ArrayBuffer)
    }
    else if(pattLett == 'E') { // SCANNER
      let cmd = new Uint8Array([0x45, cloudNum, interval]); // send cloudNum, pattHex, timingInterval
      return this.ble.write(this.deviceService.peripheral.id, this.deviceService.serviceCloud1, this.deviceService.txCloud1, cmd.buffer as ArrayBuffer)
    }
    else if(pattLett == 'F') { // FADE
      let cmd = new Uint8Array([0x45, cloudNum, interval]); // send cloudNum, pattHex, timingInterval
      return this.ble.write(this.deviceService.peripheral.id, this.deviceService.serviceCloud1, this.deviceService.txCloud1, cmd.buffer as ArrayBuffer)
    }

    let cmd = new Uint8Array([0x45, cloudNum, interval]); // send cloudNum, pattHex, timingInterval
    return this.ble.write(this.deviceService.peripheral.id, this.deviceService.serviceCloud1, this.deviceService.txCloud1, cmd.buffer as ArrayBuffer)
  }

  getPatternHex(patternLett: string) {
    switch(patternLett) {
      case 'A': {
        return 0x42;
      }
    }
    
  }

}
