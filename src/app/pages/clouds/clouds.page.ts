import { Component, OnInit, NgZone, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { PatternsService } from '../../services/patterns.service';
import { Cloud } from '../../models/cloud.model';
import { routeAnimations } from '../../animations/routes.animation';
import { fadeInFadeOut } from '../../animations/fadeInFadeOut.animation';
import { StorageService } from '../../services/storage.service';
import { PageViewService } from '../../services/page-view.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-clouds',
  templateUrl: './clouds.page.html',
  styleUrls: ['./clouds.page.scss'],
  animations: [ routeAnimations, fadeInFadeOut ]
})
export class CloudsPage implements OnInit, OnDestroy {
  clouds: Array<Cloud>;
  selCloud: Cloud; 
  selCloudIdx: number; 
  config: PerfectScrollbarConfigInterface = {};
  isColorsVisible: boolean;
  ticks: Array<number>;
  intervalTimer: number;

  constructor(
    private patService: PatternsService
    , private storageService: StorageService
    , private pageViewService: PageViewService) {
  }

  ngOnInit() {
    // this.storageService.getClouds().then(clouds => {
    //   if(clouds) {
    //     this.clouds = clouds
    //     this.setSelCloud(0);
    //   } else {
    //     this.addCloud().then(cloud => {
    //       this.setSelCloud(0);
    //     });
    //   }
    // });
    this.clouds = this.storageService.clouds;
    if(this.clouds) {
      this.setSelCloud(0);
    } else {
      this.addCloud().then(cloud => {
        this.setSelCloud(0);
      });
    }
    this.storageService.getIntervalTimer().then(timer => {
      this.intervalTimer = timer || 10;
    })
    this.pageViewService.isColorsVisible$.subscribe(x => {
      this.isColorsVisible = x;
    })
    let numTicks = Math.floor(window.innerHeight * .85 / 20);
    this.ticks = new Array<number>(numTicks).fill(0, 0, numTicks);
  }


  ngOnDestroy() {

  }

  refreshClouds() {
    // this.storageService.getClouds().then(clouds => {
    //   this.clouds = clouds;
    // })
  }

  setSelCloud(idx: number) {
    this.selCloud = this.clouds[idx];
    this.selCloudIdx = idx;
  }

  setIntervalTimer(ev: any) {
    this.intervalTimer = ev.target.value;
    this.storageService.setIntervalTimer(this.intervalTimer);
  }

  addCloud(): Promise<Array<Cloud>> { 
    if(!this.clouds) {
      return this.patService.createDefaultCloud().then(newCloud => {
        this.clouds = [ newCloud ]
        this.storageService.setClouds(this.clouds);
        return this.clouds;
      })
    }
    else {
      return this.patService.createDefaultCloud().then(newCloud => {
        this.clouds = [ ...this.clouds, newCloud ]
        this.storageService.setClouds(this.clouds);
        return this.clouds;
      })
    }
  }

  addBlock() {
      this.storageService.addBlockToCloud(this.selCloud.cloudID, this.patService.createDefaultBlock()).then(x => {
        this.refreshClouds();
      });
  }

  
}
