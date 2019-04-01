import { Component, OnInit, NgZone, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { PatternsService } from '../../services/patterns.service';
import { Cloud } from '../../models/cloud.model';
import { routeAnimations } from '../../animations/routes.animation';
import { StorageService } from '../../services/storage.service';
import { PageViewService } from '../../services/page-view.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';


import {Power1, Power2, Bounce} from 'gsap/all';
import { TimeLineMax } from 'gsap/all';

declare var TweenMax: any;
declare var TimelineMax: any;

@Component({
  selector: 'app-clouds',
  templateUrl: './clouds.page.html',
  styleUrls: ['./clouds.page.scss'],
  animations: [ routeAnimations ]
})
export class CloudsPage implements OnInit, OnDestroy {
  clouds: Array<Cloud>;
  selCloud: Cloud; 
  selCloudIdx: number; 
  blocks: Array<any>;
  config: PerfectScrollbarConfigInterface = {};

  artists = [
    'Artist I - Davido',
    'Artist II - Wizkid',
    'Artist III - Burna Boy',
    'Artist IV - Kiss Daniel',
    'Artist V - Mayorkun',
    
  ];

  constructor(
    private patService: PatternsService
    , private storageService: StorageService
    , private pageViewService: PageViewService) {
  }

  ngOnInit() {
    this.storageService.getClouds().then(clouds => {
      if(clouds) {
        this.clouds = clouds
        this.setSelCloud(0);
      } else {
        this.addCloud().then(cloud => {
          this.setSelCloud(0);
        });
      }

      console.log('clouds', this.clouds)
    })

    this.blocks = ["one", "two", "three", "four", "five"]
  }


  ngOnDestroy() {

  }

  setSelCloud(idx: number) {
    this.selCloud = this.clouds[idx];
    this.selCloudIdx = idx;
  }

  addCloud(): Promise<Array<Cloud>> {
    if(!this.clouds) {
      return this.patService.createNewCloud().then(newCloud => {
        this.clouds = [ newCloud ]
        this.storageService.setClouds(this.clouds);
        return this.clouds;
      })
    }
    else {
      return this.patService.createNewCloud().then(newCloud => {
        this.clouds = [ ...this.clouds, newCloud ]
        this.storageService.setClouds(this.clouds);
        return this.clouds;
      })
    }
    
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.artists, event.previousIndex, event.currentIndex);
  }

  dEnd(event) {
    console.log('dend', event)
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
