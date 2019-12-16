import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StorageService } from '../../../services/storage.service';
import { PatternsService } from '../../../services/patterns.service';
import { Cloud, PatternBlock } from '../../../models/cloud.model';
import { ColorEvent } from 'ngx-color';
import { PageViewService } from '../../../services/page-view.service';

interface RGBA {
  r: number,
  g: number,
  b: number,
  a: number
}

@Component({
  selector: 'app-custom-patterns',
  templateUrl: './patterns.component.html',
  styleUrls: ['./patterns.component.scss']
})
export class PatternsComponent implements OnInit {
  @Output('onColorChange') emitColorChange: EventEmitter<RGBA>;
  colors = ['#BBB','#BBB','#BBB','#BBB','#BBB','#BBB','#BBB','#BBB','#BBB','#BBB','#BBB','#BBB',
  '#BBB','#BBB','#BBB','#BBB','#BBB','#BBB','#BBB','#BBB','#BBB','#BBB','#BBB','#BBB'];
  curCloud: Cloud;
  curBlock: PatternBlock;
  curPixel: number = 0; 
  curColorHex: string = '#BBB'; 
  justSent = "";

  constructor(
    private storageService: StorageService
    , private patService: PatternsService
    , private pageViewService: PageViewService) { 
      this.emitColorChange = new EventEmitter<RGBA>();
  }

  ngOnInit() {
    this.patService.curBlock$.subscribe(x => {
      this.curBlock = x;
      // console.log(this.curBlock.blockID)
    })
    this.patService.curClou$.subscribe(x => {
      this.curCloud = x;
      // console.log(this.curBlock.blockID)
    })
  }

  removeBlock() {
    this.storageService.removeBlockFromCloud(this.curCloud.cloudID, this.curBlock).then(x =>{
      this.hideColors();
    });
  }

  hideColors() {
    this.pageViewService.setColorsVisibleFalse();
  }

  onColorChange(ev: ColorEvent) {
    // console.log('rgbbb', ev.color.rgb);
    this.curColorHex = ev.color.hex;
    this.emitColorChange.emit(ev.color.rgb);
  }

  onPixelSelect(selPixelIdx: number) {
    // console.log('selected pixel: ', selPixelIdx);
    this.colors[selPixelIdx] = this.curColorHex;
  }

  onChangeBlockName(ev: any) {
    let newName = ev.target.value;
    this.curBlock.name = newName;
    this.storageService.changeBlockName(this.curBlock.blockID, newName);
  }

  onChangeBlockPatLet(ev: any) {
    let newBlockPatLet = ev.target.value;
    this.curBlock.blockPatLet = newBlockPatLet;
    this.storageService.changeBlockPatLet(this.curBlock.blockID, newBlockPatLet).then(x => {
      // this.patService.beginColor();
    });
  }

  // onChangeBlockHeight(ev: any) {
  //   let newBlockHeight = ev.target.value as number;
  //   this.curBlock.height = newBlockHeight;
  //   this.storageService.changeBlockHeight(this.curBlock.blockID, newBlockHeight);
  // }

  onChangeBlockHeight() {
    this.storageService.changeBlockHeight(this.curBlock.blockID, this.curBlock.height);
  }

  onChangeBrightness(ev: any) {
    let newBrightness = ev.target.value as number;
    this.curBlock.brightness = newBrightness;
    this.storageService.changeBlockHeight(this.curBlock.blockID, newBrightness);
  }


  sendColorWipe() {
    this.justSent = "Color Wipe";
    this.patService.sendAnything("D", 1, 30, null);
  }

  sendFade() {
    this.justSent = "Fade";
    this.patService.sendPattern(1, "F", 50);
  }

  changeComplete($event: ColorEvent) {
    let color = $event.color;

    this.patService.sendAnything("D", this.curCloud.cloudNum, 30, {r: color.rgb.r, g: color.rgb.g, b: color.rgb.b});
    this.justSent = "Color Wipe";


    // console.log($event.color);
    
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
