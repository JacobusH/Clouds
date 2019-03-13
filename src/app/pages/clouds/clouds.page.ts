import { Component, OnInit, NgZone, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { PatternsService } from '../../modules/shared/services/patterns.service';
import { Cloud } from '../../modules/shared/models/cloud.model';
import { routeAnimations } from '../../animations/routes.animation';
import { StorageService } from '../..//modules/shared/services/storage.service';

@Component({
  selector: 'app-clouds',
  templateUrl: './clouds.page.html',
  styleUrls: ['./clouds.page.scss'],
  animations: [ routeAnimations ]
})
export class CloudsPage implements OnInit, OnDestroy {
  clouds: Array<Cloud>;
  selCloud: Cloud; 

  constructor(
    private patService: PatternsService
    , private storageService: StorageService) {
  }

  ngOnInit() {
    this.storageService.getClouds().then(x => {
      // x is an array of clouds
      if(x) {
        this.clouds = x
      } else {
        this.clouds = [ this.patService.createNewCloud() ]
        this.storageService.setClouds(this.clouds);
      }

      console.log('clouds', this.clouds)
    })
  }


  ngOnDestroy() {

  }

  setSelCloud(idx: number) {
    this.selCloud = this.clouds[idx];
  }

  
}
