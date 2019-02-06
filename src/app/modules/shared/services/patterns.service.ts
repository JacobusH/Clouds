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

  PATTERNS = {'rainbow': 'rainbow', 'theater': 'theater','colorwipe': 'colorwipe','scanner': 'scanner', 'fade': 'fade'}

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

  sendPattern(cloudNum: number, pattern: string, interval: number) {
    console.log('patternservice', cloudNum, pattern, interval)
    let hexxy = 0x41;
    if(pattern == this.PATTERNS.rainbow) { // RAINBOW_CYCLE, A
      hexxy = 0x41;
    }
    else if(pattern == this.PATTERNS.theater) { // THEATER_CHASE, C
      hexxy = 0x43;
    }
    else if(pattern == this.PATTERNS.colorwipe) {  // COLOR_WIPE, D
      hexxy = 0x44;
    }
    else if(pattern == this.PATTERNS.scanner) { // SCANNER, E
      hexxy = 0x45;
    }
    else if(pattern == this.PATTERNS.fade) { // FADE, F
      hexxy = 0x46;
    }
    else if(pattern == 'Y') { // ON, Y
      hexxy = 0x59;
    }
    else if(pattern == 'Z') { // OFF, Z
      hexxy = 0x5A;
    }

    let cmd = new Uint8Array([hexxy, cloudNum, interval]); // send cloudNum, pattHex, timingInterval
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
