import { Component, OnInit, NgZone, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Power1, Bounce } from 'gsap/all';
import { TweenLite } from "gsap";
import { interval } from 'rxjs';
import { grow, growSlowly } from '../../../../animations/grow.animation'
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

interface Flower {
  width: number,
  bottom: number,
  left: number
  index?: number
}

@Component({
  selector: 'app-flowers',
  templateUrl: './flowers.component.html',
  styleUrls: ['./flowers.component.scss'],
  animations: [ grow, growSlowly ]
})
export class FlowersComponent implements OnInit, AfterViewInit {
  flowers = [];
  trees = [];
  curflowerCount: number = 0;
  totalFlowers: number = 200;
  curTreeCount: number = 0;
  totalTreeCount: number = 10;

  constructor(private ngZone: NgZone) { }

  ngOnInit() {
    let flower: Flower = { 'width': 0, 'bottom': 0, 'left': 0, 'index': 0 };
    let treeFlower: Flower = { 'width': 0, 'bottom': 0, 'left': 0, 'index': 0 };
    let upperBound = 54;
    let lowerBound = 15 // 140
    let rightBound = 100;
    let leftBound = 0;
    let left = -1;
    let bottom = -1;

    let firstTree = {
      'width': 30
      , 'bottom': 45
      , 'left': 12
      , 'index': 300
    }
    
    this.ngZone.run(() => {
      this.trees.push(firstTree);

      let flowerMaker$ = interval(1000).subscribe(n => {
        left = this.randomIntFromInterval(leftBound, rightBound);
        bottom = this.randomIntFromInterval(lowerBound, upperBound);
        
        let width = this.getWidth(bottom);
        width = (this.curflowerCount % 5 == 1 || this.curflowerCount % 5 == 3) ? width + 4 : width; // make rose bigger

        flower = { 
          'width': width
          , 'bottom': bottom
          , 'left': left
          , 'index': this.getZIndex(bottom)
        };
        this.flowers.push(flower);
        this.curflowerCount++;
        
        if(this.curflowerCount >= this.totalFlowers) {
          flowerMaker$.unsubscribe();
        }
        // console.log(`It's been ${n} seconds since subscribing!`)
      });

      let treeMaker$ = interval(60000).subscribe(n => {
        lowerBound = 37;
        upperBound = 45;
        left = this.randomIntFromInterval(leftBound, rightBound);
        bottom = this.randomIntFromInterval(lowerBound, upperBound);
        
        let width = this.getWidth(bottom);
        // width = (this.curflowerCount % 5 == 1 || this.curflowerCount % 5 == 3) ? width + 4 : width; // make tree bigger
        width = width + 20;
        treeFlower = { 
          'width': width
          , 'bottom': bottom
          , 'left': left
          , 'index': this.getZIndex(bottom)
        };
        // this.trees.push(treeFlower);
        this.curTreeCount++;

        if(this.curTreeCount >= this.totalTreeCount) {
          treeMaker$.unsubscribe();
        }
      })

    })
  }

  ngAfterViewInit() {
    // let flowers = document.getElementsByClassName("flower");   
    // TweenLite.to(flowers, 2, {width:"50px", height:"300px"});

  }

  setFlowerStyles(width, bottom, left, zIndex) {
    let styles = {};
    styles['position'] = 'absolute';
    styles['width'] = width + '%';
    styles['left'] = left + '%';
    styles['bottom'] = bottom + '%';
    styles['z-index'] = zIndex;

    return styles; 
  }

  getWidth(bottom: number) {
    if(bottom < 10) {
      return 8;
    }
    else if(bottom < 20) {
      return 7;
    }
    else if(bottom < 30) {
      return 6;
    }
    else if(bottom < 40) {
      return 5;
    }
    else if(bottom <= 50) {
      return 4;
    }
    else {
      return 3;
    }
  }

  getZIndex(bottom: number) {
    return Math.floor((1 / bottom) * 9000);
  }

  randomIntFromInterval(min,max) // min and max included
  {
      return Math.floor(Math.random()*(max-min+1)+min);
  }


  // doIt(): void {
  //   TweenMax.fromTo(this.box.nativeElement, 2, {x: 20}, {x: 440, ease: Power1.easeOut});
  //   TweenMax.fromTo(this.box.nativeElement, 2, {y: 20}, {y: 440, ease: Bounce.easeOut});
  // }

}
