import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {
  public bhSub = new BehaviorSubject<boolean>(true);
  isShowSettings$ = this.bhSub.asObservable();
  
  constructor() { }
  
  toggleState(){
    this.bhSub.next(!this.bhSub.value);
  }

  setShowSettingsTrue(){
    this.bhSub.next(true);
  }

  setShowSettingsFalse(){
    this.bhSub.next(false);
  }
}
