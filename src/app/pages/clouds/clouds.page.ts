import { Component, OnInit, NgZone, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { PatternsService } from '../../modules/shared/services/patterns.service';
import { Cloud } from '../../modules/shared/models/cloud.model';
import { routeAnimations } from '../../animations/routes.animation';

@Component({
  selector: 'app-clouds',
  templateUrl: './clouds.page.html',
  styleUrls: ['./clouds.page.scss'],
  animations: [ routeAnimations ]
})
export class CloudsPage implements OnInit, OnDestroy {

  constructor(
    private patService: PatternsService) {
  }

  ngOnInit() {

  }


  ngOnDestroy() {

  }

  
}
