import { Injectable } from '@angular/core';
import { Cloud, PatternBlock } from "../models/cloud.model";
import { BLE } from '@ionic-native/ble/ngx';
import { DeviceService } from './device.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable, BehaviorSubject, interval, timer, Subscription, Subject } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { v4 as uuid } from 'uuid';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class PatternsService {
  bhCurBlock = new BehaviorSubject<PatternBlock>(null);
  bhCurCloud = new BehaviorSubject<Cloud>(null);
  curBlock$ = this.bhCurBlock.asObservable();
  curClou$ = this.bhCurCloud.asObservable();
  colPatters = '!Patterns';
  PATTERNS = {'rainbow': 'A', 'theater': 'C','colorwipe': 'D','scanner': 'E', 'fade': 'F'}
  colorTimer$: Subscription;
  private reset$ = new Subject();

  constructor(
    private ble: BLE 
    , private deviceService: DeviceService
    , private storageService: StorageService) { 
      this.colorTimer$ = null;
  }

  setCurrentPatternBlock(patBlock: PatternBlock){
    console.log("new pat block id", patBlock.blockID)
    this.bhCurBlock.next(patBlock);
  }

  setCurrentCloud(cloud: Cloud){
    console.log("new cloud id", cloud.cloudID)
    this.bhCurCloud.next(cloud);
  }

  createDefaultCloud(): Promise<Cloud> {
    let cloudID = uuid();
    return this.storageService.getClouds().then(clouds => {
      let cNum = 0
      if(clouds) { cNum = clouds.length; }
      return {
        cloudID: cloudID,
        cloudNum: cNum,
        numPixels: 24,
        curBrightness: 125,
        isActive: true,
        buildingBlocks: [ this.createDefaultBlock() ]
      }
    });
  }

  createDefaultBlock(blockId = "", name = "New"): PatternBlock {
    let startHeight = 100;
    let beginning = 0;
    let end = startHeight + beginning;
    return {
      blockID: (blockId == "" ? uuid() : blockId),
      name: name,
      coordinates: { x: 0, y: 0},
      height: startHeight,
      beginning: beginning,
      end: end,
      blockPatLet: 'A',
      brightness: 125,
      pixels: Array<string>().fill('#8B008B', 0, 23),
    }
  }

  ///////
  // Commands to send to controller
  ///////
  resetTimer() {
    this.reset$.next();
  }

  beginColor() {
    this.storageService.getIntervalTimer().then(interval => {
      this.storageService.getClouds().then(c => {
        console.log('in begin colors')
        if(c) {

        
        let maxVal = -1;
        let clouds = c as Cloud[];
        clouds.forEach(cloud => {
          for(var i = 0; i < cloud.buildingBlocks.length; i++) { // just send first block for now
            cloud.buildingBlocks[i].hasSent = false;
            if(cloud.buildingBlocks[i].end > maxVal) {
              maxVal = cloud.buildingBlocks[i].end;
            }
          }
        })
        console.log('maxval', maxVal)

        // timer
        let loopNum = 0;
        if(this.colorTimer$) {
          this.colorTimer$.unsubscribe()
        }
        this.colorTimer$ = timer(1000, 50).subscribe(val => {
          let curTime = val * 50;
          // console.log(curTime);
          clouds.forEach(cloud => {
            for(var i = 0; i < cloud.buildingBlocks.length; i++) { 
              // if(curTime >= cloud.buildingBlocks[i].height && !cloud.buildingBlocks[i].hasSent) { // 
              console.log('ouuta if')
              if(curTime >= cloud.buildingBlocks[i].beginning && curTime <= cloud.buildingBlocks[i].end && !cloud.buildingBlocks[i].hasSent) { // 
                cloud.buildingBlocks[i].hasSent = true;
                console.log(`time: ${curTime} | cloudNum ${cloud.cloudNum} | patternLet: ${cloud.buildingBlocks[i].blockPatLet}
                  | interval: ${interval}`);
                this.sendPattern(cloud.cloudNum+1, cloud.buildingBlocks[i].blockPatLet, interval);
              }
            }
          })

          if(curTime > maxVal) {
            // curTime = curTime - (maxVal*loopNum);
            this.colorTimer$.unsubscribe();
            this.beginColor();
          }
          
        });
      }
        
      })
    })
  }

  restartTimer() {
    
  }

  sendCommand(cmd: string) {
    let data = new TextEncoder().encode(cmd);
    return this.ble.write(this.deviceService.peripheral.id, this.deviceService.serviceCloud1, this.deviceService.txCloud1, data.buffer as ArrayBuffer)
  }

  setBrightness(brightness: number) {
    console.log('setBrightness');
    let cmd = new Uint8Array([0x42, brightness]); // send B
    this.ble.write(this.deviceService.peripheral.id, this.deviceService.serviceCloud1, this.deviceService.txCloud1, cmd.buffer as ArrayBuffer).then(
      () => {
          console.log('Sent B');
        },
      () => console.log('Error updating brightness')
    );
  }

  sendPattern(cloudNum: number, pattern: string, interval: number) {
    // if (location.hostname != "localhost") {
      // console.log('patternservice', cloudNum, pattern, interval)
      let hexxy = 0x41;
      if(pattern == this.PATTERNS.rainbow) { // RAINBOW_CYCLE, A
        hexxy = 0x41;
      }
      else if(pattern == this.PATTERNS.theater) { // THEATER_CHASE, C
        hexxy = 0x43;
      }
      else if(pattern == this.PATTERNS.colorwipe) {  // COLOR_WIPE, D
        hexxy = 0x44;
      }
      else if(pattern == this.PATTERNS.scanner) { // SCANNER, E
        hexxy = 0x45;
      }
      else if(pattern == this.PATTERNS.fade) { // FADE, F
        hexxy = 0x46;
      }
      else if(pattern == 'Y') { // ON, Y
        hexxy = 0x59;
      }
      else if(pattern == 'Z') { // OFF, Z
        hexxy = 0x5A;
      }
      // console.log('hexxy', hexxy)

      let cmd = new Uint8Array([hexxy, cloudNum, interval]); // send cloudNum, pattHex, timingInterval
      return this.ble.write(this.deviceService.peripheral.id, this.deviceService.serviceCloud1, this.deviceService.txCloud1, cmd.buffer as ArrayBuffer);
    // }
    
  }

  sendAnything(pattern: string, cloudNum: number, interval: number, colors: {r: number, g: number, b: number}) {
    let hexxy = 0x44;

    let cmd = new Uint8Array([hexxy, cloudNum, interval, colors.r, colors.g, colors.b]); // send cloudNum, pattHex, timingInterval
    return this.ble.write(this.deviceService.peripheral.id, this.deviceService.serviceCloud1, this.deviceService.txCloud1, cmd.buffer as ArrayBuffer);

  }

  getPatternHex(patternLett: string) {
    switch(patternLett) {
      case 'A': {
        return 0x42;
      }
    }
    
  }

}
