import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-state-circle',
  templateUrl: './state-circle.component.html',
  styleUrls: ['./state-circle.component.scss']
})
export class StateCircleComponent implements OnInit {
  @Input('items') items = ['item1', 'item2', 'item3', 'item4', 'item4', 'item5'
                            , 'item1', 'item2', 'item3', 'item4', 'item4', 'item5'
                            , 'item1', 'item2', 'item3', 'item4', 'item4', 'item5'
                            , 'item1', 'item2', 'item3', 'item4', 'item4', 'item5'
                            , 'item1', 'item2', 'item3', 'item4'];
  @Input('menuRadius') menuRadius: number = 50;
  @Input('itemRadius') itemRadius = 5;
  step: number;
  angle: number;
 
  constructor() { }

  ngOnInit() {
    this.step = (2*Math.PI) / this.items.length
    this.angle = 0;

  }

  determineItemCX(position: number) {
    this.angle = position * this.step;
    return Math.round(this.itemRadius / 2 + this.menuRadius * Math.cos(this.angle) - this.itemRadius / 2) + this.menuRadius + this.itemRadius;
  }

  determineItemCY(position: number) {
    this.angle = position * this.step;
    return Math.round(this.itemRadius/2 + this.menuRadius * Math.sin(this.angle) - this.itemRadius/2) + this.menuRadius + this.itemRadius;
  }


}
