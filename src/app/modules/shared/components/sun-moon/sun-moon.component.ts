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
      if(left <= 0) { 
        this.sunOpacity = 1;
        this.moonOpacity = 0;
      }
      else if(right >= window.innerWidth) {
        this.sunOpacity = 0;
        this.moonOpacity = 1;
      }
      else { // in betwewen 
        let sunny = 1 - (left / window.innerWidth);
        let moony = right / window.innerWidth;

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
      toEmit = 50;
    }
    else if(opacityVal >= 1) {
      toEmit = 255;
    }
    this.brightness.emit(toEmit);
    console.log('emitted brightness', toEmit)
  }

}
