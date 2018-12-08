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

}
