import { Component, OnInit, HostListener } from '@angular/core';
import { PageViewService } from '../../services/page-view.service';
import {Power1, Power2, Bounce} from 'gsap/all';
import { TimeLineMax } from 'gsap/all';

declare var TweenMax: any;
declare var TimelineMax: any;

@Component({
  selector: '[app-home-house]',
  templateUrl: './home-house.component.html',
  styleUrls: ['./home-house.component.scss']
})
export class HomeHouseComponent implements OnInit {
  innerWidth;
  isWindowOpen = false;

  constructor(private pageViewService: PageViewService) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.pageViewService.isVisible$.subscribe(x => {
      this.isWindowOpen = x;
      // console.log('home', x)
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  togglePageView(val: boolean) {
    if(val) {
      this.pageViewService.setVisibleTrue();
    }
    else {
      this.pageViewService.setVisibleFalse();
    }
  }

  getHouseWidth() {
    return "50%";
  }

  doIt(): void {
    // TweenMax.fromTo(this.bunnyShroom.nativeElement, 2, {x: 20}, {x: 440, ease: Power1.easeOut});
    // TweenMax.fromTo(this.bunnyShroom.nativeElement, 2, {y: 20}, {y: 440, ease: Bounce.easeOut});

    // TweenMax.to(this.left.nativeElement, 1, {
    //   attr: {
    //     points: '125,30 125,30 125,30 31.9,30 31.9,230 125,230 125,230 125,230 203.9,186.3 218.1,63.2'
    //   },
    //   repeat: -1,
    //   yoyo: true,
    //   ease: Power1.easeInOut
    // });
    // TweenMax.to(this.right.nativeElement, 1, {
    //   attr: {
    //     points: '125,30 125,52.2 125,52.1 125,153.4 125,153.4 125,230 125,230 218.1,230 218.1,30 125,30'
    //   },
    //   repeat: -1,
    //   yoyo: true,
    //   ease: Power1.easeInOut
    // });

    // TimelineMax.from(this.stem.nativeElement, 0.5, {scaleY: 0, transformOrigin: "bottom", ease: Power2.easeOut})
  }

}
