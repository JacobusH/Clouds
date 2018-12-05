import { Injectable } from '@angular/core';
import { PatternsEnum } from '../../../modules/shared/models/patterns.model';
import { BLE } from '@ionic-native/ble/ngx';
import { DeviceService } from './device.service';


@Injectable({
  providedIn: 'root'
})
export class PatternsService {
 
  constructor(
    private ble: BLE 
    , private deviceService: DeviceService) { 
      
  }

  // Commands to send to controller
  sendCommand(cmd: string) {
    let data : Uint8Array;
    
 
    switch(cmd) {
      case 'A':
        data = new Uint8Array([0x41]); // A
        this.ble.write(this.deviceService.peripheral.id, this.deviceService.serviceCloud1, this.deviceService.txCloud1, data.buffer as ArrayBuffer)
        break;
    } 
  }
}
