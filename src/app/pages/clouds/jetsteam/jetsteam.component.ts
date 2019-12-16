import { Component, OnInit, NgZone, OnDestroy, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { PatternsService } from '../../../services/patterns.service';
import { Cloud, PatternBlock } from '../../..//models/cloud.model';
import { routeAnimations } from '../../..//animations/routes.animation'; 
import { StorageService } from '../../..//services/storage.service';
import { PageViewService } from '../../..//services/page-view.service';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-jetsteam',
  templateUrl: './jetsteam.component.html',
  styleUrls: ['./jetsteam.component.scss']
})
export class JetsteamComponent implements OnInit {
  @Input() cloudIdx: number; 
  @Input() cloudID: string; 
  @Input() cloud: Cloud; 
  blocks: Array<PatternBlock>;

  constructor(
    private storageService: StorageService
    , private pageViewService: PageViewService
    , private patService: PatternsService ) { }

  ngOnInit() {
    // this.storageService.getBlocksByCloudIdx(this.cloudIdx).then(blocks => {
    //   this.blocks = blocks;
    // })
    this.blocks = this.cloud.buildingBlocks;
  }


  // drop(event: CdkDragDrop<{'blocks': string[], 'cloudID': string}>) {
  drop(event: any) {
    if (event.previousContainer !== event.container) {
      let blockToMove = event.previousContainer.data.blocks[event.previousIndex];
      this.storageService.moveBlockBetweenClouds(event.previousContainer.data.cloudID, event.container.data.cloudID, blockToMove);
      transferArrayItem(event.previousContainer.data.blocks, event.container.data.blocks, event.previousIndex, event.currentIndex);
    } 
    else {
      moveItemInArray(event.container.data.blocks, event.previousIndex, event.currentIndex);
    }
  }

  dEnd(event) {
    // console.log('dend', event)
  }

}
