import { Component, OnInit, Input } from '@angular/core';
import { StorageService } from '../../../services/storage.service';
import { PatternsService } from '../../../services/patterns.service';
import { Cloud, PatternBlock } from '../../../models/cloud.model';
import { ColorEvent } from 'ngx-color';

@Component({
  selector: 'app-custom-patterns',
  templateUrl: './patterns.component.html',
  styleUrls: ['./patterns.component.scss']
})
export class PatternsComponent implements OnInit {
  @Input('curCloud') curCloud: Cloud;
  clouds: Array<Cloud>;
  curBlock: PatternBlock;
  justSent = "";

  constructor(
    private storageService: StorageService
    , private patService: PatternsService) { 
  }

  ngOnInit() {
    // this.storageService.getClouds().then(x => {
    //   // x is an array of clouds
    //   if(x) {
    //     this.clouds = x
    //   } else {
    //     this.clouds = [ this.patService.createNewCloud() ]
    //   }
    //   this.curCloud = this.clouds[0]
    //   this.curBlock = this.curCloud.buildingBlocks[0]
    // });
  }

  sendColorWipe() {
    this.justSent = "Color Wipe";
    this.patService.sendAnything("D", 1, 30, null);
  }

  sendFade() {
    this.justSent = "Color Wipe";
    this.patService.sendPattern(1, "F", 50);
  }

  changeComplete($event: ColorEvent) {
    let color = $event.color;

    this.patService.sendAnything("D", this.curCloud.cloudNum, 30, {r: color.rgb.r, g: color.rgb.g, b: color.rgb.b});
    this.justSent = "Color Wipe";


    console.log($event.color);
    // color = {
    //   hex: '#333',
    //   rgb: {
    //     r: 51,
    //     g: 51,
    //     b: 51,
    //     a: 1,
    //   },
    //   hsl: {
    //     h: 0,
    //     s: 0,
    //     l: .20,
    //     a: 1,
    //   },
    // }
  }


}
