import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, NgZone } from '@angular/core';
import {
  moveItemInArray, transferArrayItem,
  CdkDragDrop, CdkDragMove, CdkDragStart, CdkDragEnd, CdkDragEnter, CdkDragExit
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-sun-moon',
  templateUrl: './sun-moon.component.html',
  styleUrls: ['./sun-moon.component.scss']
})
export class SunMoonComponent implements OnInit {
  @ViewChild('ElementRefName') element: ElementRef;
  @Output('brightness') brightness: EventEmitter<number> = new EventEmitter(); // 0 - 255
  sunOpacity: number = 1;
  moonOpacity: number = 0;
  curBrightness: number = 0;
  emitter = { 'min': 1, 'max': 255 }

  constructor(private ngZone: NgZone) { }

  ngOnInit() {
  }

  dragStarted(event: CdkDragStart) {
    console.log('dragStarted Event > item', event);
  }
 
  dragEnded(event: CdkDragEnd) {
    let coord = event.source.element.nativeElement.getBoundingClientRect();
    this.setSunMoonOpacity(coord.left, coord.right);
  }

  // dragMoved(event: CdkDragMove) {
  //   console.log(`> Position X: ${event.pointerPosition.x} - Y: ${event.pointerPosition.y}`);
  // }

  setSunMoonOpacity(left: number, right: number) {
    this.ngZone.run(() => {
      let middle = (right + left) / 2;
      if(middle <= 0) { 
        this.sunOpacity = 1;
        this.moonOpacity = 0;
      }
      else if(middle >= window.innerWidth) {
        this.sunOpacity = 0;
        this.moonOpacity = 1;
      }
      else { // in betwewen 
        let sunny = 1 - (middle / window.innerWidth);
        let moony = middle / window.innerWidth;

        this.sunOpacity = sunny;
        this.moonOpacity = moony;
      }
  
      // console.log('left, right, width', left, right, window.innerWidth )
      this.calculateBrightness(this.sunOpacity);
    })
  }

  calculateBrightness(opacityVal: number) {
    let toEmit = 0;
    if(opacityVal <= 0) {
      toEmit = this.emitter.min;
    }
    else if(opacityVal >= 1) {
      toEmit = this.emitter.max;
    }
    else { // in between
      toEmit = Math.floor(opacityVal * 255);
    }
    this.brightness.emit(toEmit);
    console.log('emitted brightness', toEmit)

    this.ngZone.run(() => {
      this.curBrightness = toEmit
    })
  }

}
