import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageViewService {
  public bhSub = new BehaviorSubject<boolean>(false);
  isVisible$ = this.bhSub.asObservable();

  public bhSub2 = new BehaviorSubject<boolean>(false);
  isColorsVisible$ = this.bhSub2.asObservable();

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

  setColorsVisibleFalse(){
    this.bhSub2.next(false);
    return false;
  }

  setColorsVisibleTrue(){
    this.bhSub2.next(true);
    return true;
  }
  

}
