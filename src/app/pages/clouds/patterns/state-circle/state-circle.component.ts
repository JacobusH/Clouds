import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { PageViewService } from '../../../../services/page-view.service';

@Component({
  selector: 'app-state-circle',
  templateUrl: './state-circle.component.html',
  styleUrls: ['./state-circle.component.scss']
})
export class StateCircleComponent implements OnInit {
  @Input('colors') colors: Array<string>;
  @Input('menuRadius') menuRadius: number = 50;
  @Input('itemRadius') itemRadius = 10;
  @Input('curColor') curColor: string;
  @Output('onPixelSelect') onPixelSelect: EventEmitter<number>;
  step: number;
  angle: number;
  driftFac: number; 
  highestY: number = 0;
  svgH: number = 0;
 
  constructor(private pageViewService: PageViewService) { 
    this.onPixelSelect = new EventEmitter<number>();
  }

  ngOnInit() {
    this.step = (2*Math.PI) / this.colors.length;
    this.angle = 0;
    this.driftFac = window.innerWidth / 5;
    this.menuRadius = window.innerWidth / 4; 
    this.findHighestY();
  }

  determineItemCX(position: number) {
    this.angle = position * this.step;
    return Math.round(this.itemRadius / 2 + this.menuRadius * Math.cos(this.angle) - this.itemRadius / 2) + this.menuRadius + this.itemRadius + this.driftFac;
  }

  determineItemCY(position: number) {
    this.angle = position * this.step;
    return Math.round(this.itemRadius/2 + this.menuRadius * Math.sin(this.angle) - this.itemRadius/2) + this.menuRadius + this.itemRadius;
  }

  setPixel(idx: number) {
    this.onPixelSelect.emit(idx);
  }

  back() {
    this.pageViewService.setColorsVisibleFalse();
  }

  findHighestY() {
    for(let i = 0; i < this.colors.length; i++) {
      let angy = i * this.step;
      let pos = Math.round(this.itemRadius/2 + this.menuRadius * Math.sin(angy) - this.itemRadius/2) + this.menuRadius + this.itemRadius;
      if(pos > this.highestY) {
        this.highestY = pos;
      }
    }
    this.svgH = this.highestY + 10;
  }


}
