import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageViewService {
  public bhSub = new BehaviorSubject<boolean>(false);
  isVisible$ = this.bhSub.asObservable();

  constructor() { 

  }

  setVisibleFalse(){
    this.bhSub.next(false);
    return false;
  }

  setVisibleTrue(){
    this.bhSub.next(true);
    return true;
  }
  

}
