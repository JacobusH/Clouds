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
    // let data = new Uint8Array([brightness]);
    // let data = new TextEncoder().encode(this.brightnessBullshit(brightness));
    this.ble.write(this.deviceService.peripheral.id, this.deviceService.serviceCloud1, this.deviceService.txCloud1, cmd.buffer as ArrayBuffer).then(
      () => {
          console.log('Sent B');
          // this.ble.write(this.deviceService.peripheral.id, this.deviceService.serviceCloud1, this.deviceService.txCloud1, data.buffer as ArrayBuffer).then(
          //   () => console.log('Sent brightness value'),
          //   () => console.log('Failed to send brightness')
          // )
        },
      () => console.log('Error updating brightness')
    );
  }

  brightnessBullshit(curBrightness: number) {
    if(curBrightness < 50) {
      return 'A';
    }
    else if(curBrightness < 75) {
      return 'B';
    }
    else if(curBrightness < 100) {
      return 'C';
    }
    else if(curBrightness < 125) {
      return 'D';
    }
    else if(curBrightness < 150) {
      return 'E';
    }
    else if(curBrightness < 175) {
      return 'F';
    }
    else if(curBrightness < 225) {
      return 'G';
    }
    else if(curBrightness < 250) {
      return 'H';
    }
    else {
      return 'I';
    }

    return 'I';
  }

}
