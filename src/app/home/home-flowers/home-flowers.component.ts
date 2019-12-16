import { Component, OnInit, NgZone, ElementRef, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { Power1, Bounce } from 'gsap/all';
import { TweenLite } from "gsap";
import { interval } from 'rxjs';
import { grow, growSlowly } from '../../animations/grow.animation';
import { 
  trigger,  
  state, 
  style, 
  animate,
  transition
} from '@angular/animations';  
import { first } from 'rxjs/operators';
import { from, of, pipe } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators'; 
import { Observable, BehaviorSubject } from 'rxjs';
 
interface Flower {
  width: number,
  bottom: number,
  left: number
  index?: number
}

@Component({
  selector: '[app-home-flowers]',
  templateUrl: './home-flowers.component.html',
  styleUrls: ['./home-flowers.component.scss'],
  animations: [ grow, growSlowly ]
})
export class HomeFlowersComponent implements OnInit, AfterViewInit {
  flowers = [];
  trees = [];
  curflowerCount: number = 0;
  totalFlowers: number = 250;
  curTreeCount: number = 0;
  totalTreeCount: number = 0;

  _list: Flower[] = [];
  _observableList: BehaviorSubject<Flower[]> = new BehaviorSubject([]);
  get observableList(): Observable<Flower[]> { return this._observableList.asObservable() }
  addFlower(person: Flower) {
      this._list.push(person);
      this._observableList.next(this._list);
  }
  removeFlower() {
    // this._list.shift(); // remove first elem
    this._list[0] = {
      bottom: -1,
      index: 0,
      left: -1,
      width: 0
    }
    this._observableList.next(this._list);
}

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

    // let firstTree = {
    //   'width': 30
    //   , 'bottom': 45
    //   , 'left': 12
    //   , 'index': 300
    // }
    
    this.ngZone.run(() => {
      let obby$ = of([1,2,3,4,5]);
      obby$.subscribe(x => {
        // console.log('obby', x)
      })
      // this.trees.push(firstTree);

      let flowerMaker$ = interval(1000).subscribe(n => {
        left = this.randomIntFromInterval(leftBound, rightBound);
        bottom = this.randomIntFromInterval(lowerBound, upperBound);
        
        let width = this.getWidth(bottom);
        // width = (this.curflowerCount % 5 == 1 || this.curflowerCount % 5 == 3) ? width + 4 : width; // make rose bigger

        flower = { 
          'width': width
          , 'bottom': bottom
          , 'left': left
          , 'index': this.getZIndex(bottom)
        };
        this.flowers.push(flower);
        // this.addFlower(flower);
        // console.log(this._observableList)
        
        
        if(this.curflowerCount >= this.totalFlowers) {
          flowerMaker$.unsubscribe();
          // this.removeFlower();
          // this.flowers.reverse().pop;
        }
        else {
          this.curflowerCount++;
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

  getWidth(yHeight: number) {
    let flowerSize = { biggest: 5.1, smallest: .3, inc: .3, cur: -1 };
    let space = { highest: 70, lowest: 10, inc: 5, cur: -1 };

    space.cur = space.lowest;
    flowerSize.cur = flowerSize.smallest;
    for(space.inc; space.cur  < space.highest; space.cur += space.inc) {
      if(yHeight <= space.cur) {
        return (flowerSize.cur <= flowerSize.biggest) 
          ? flowerSize.cur : flowerSize.biggest;
      }
      else {
        flowerSize.cur += flowerSize.inc;
      }
    }

    return 20;
  }

  getZIndex(bottom: number) {
    return Math.floor((1 / bottom) * 9000);
  }

  randomIntFromInterval(min,max) // min and max included
  {
      return Math.floor(Math.random()*(max-min+1)+min);
  }

  trackElement(index: number, element: Flower) {
    return element ? element.left : null;
  }


  // doIt(): void {
  //   TweenMax.fromTo(this.box.nativeElement, 2, {x: 20}, {x: 440, ease: Power1.easeOut});
  //   TweenMax.fromTo(this.box.nativeElement, 2, {y: 20}, {y: 440, ease: Bounce.easeOut});
  // }

}
