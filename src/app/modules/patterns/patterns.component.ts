import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../modules/shared/services/storage.service';
import { PatternsService } from '../../modules/shared/services/patterns.service';
import { Cloud, PatternBlock } from '../../modules/shared/models/cloud.model';

@Component({
  selector: 'app-custom-patterns',
  templateUrl: './patterns.component.html',
  styleUrls: ['./patterns.component.scss']
})
export class PatternsComponent implements OnInit {
  clouds: Array<Cloud>;
  curCloud: Cloud;
  curBlock: PatternBlock;

  constructor(
    private storageService: StorageService
    , private patService: PatternsService) { 
  }

  ngOnInit() {
    this.storageService.getClouds().then(x => {
      // x is an array of clouds
      if(x) {
        this.clouds = x
      } else {
        this.clouds = [ this.patService.createNewCloud() ]
      }
      this.curCloud = this.clouds[0]
      this.curBlock = this.curCloud.buildingBlocks[0]
    });
  }

  setCurCloud(idx: number) {
    this.curCloud = this.clouds[idx];
  }


}
