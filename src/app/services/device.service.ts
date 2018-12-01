import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  public bhSub = new BehaviorSubject<boolean>(true);
  cfState$ = this.bhSub.asObservable();

  selectedDevice: any;
  
  constructor() { }
  
  toggleState(){
    this.bhSub.next(!this.bhSub.value);
  }

  setDevice(device: any) {
    this.selectedDevice = device;
    // this.bhSub.next(true);
  }

  setStateFalse(){
    this.bhSub.next(false);
  }
}
