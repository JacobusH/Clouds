import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Cloud, PatternBlock } from '../models/cloud.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  clouds: Array<Cloud>;
  CLOUDS = 'clouds';
  TIMER = 'intervalTimer';

  constructor(private storage: Storage) { 
    this.getClouds().then(x => {
      this.clouds = x;
    })
  }

  // INTERVAL TIMER 
  setIntervalTimer(timerVal: number) {
    this.storage.set(this.TIMER, timerVal);
  }

  getIntervalTimer(): Promise<any> {
    return this.storage.get(this.TIMER)
  }

  // CLOUDS
  refreshClouds(): Promise<any> {
    return this.getClouds();
  }

  setClouds(clouds: Array<Cloud>): Promise<void> {
    return this.storage.set(this.CLOUDS, clouds).then(x => {
      this.clouds = clouds;
    });
  }

  getClouds(): Promise<any> {
    // return this.storage.get(this.CLOUDS).then(clouds => {
    //   this.clouds = clouds;
    // });
    return this.storage.get('clouds');
  }

  getCloudByID(id: string): Promise<any> {
    return this.storage.get(this.CLOUDS).then(clouds => {
      clouds.forEach(el => {
        if(el.cloudID == id) {
          return el;
        }
      });
    })
  }

  refreshCloud(cloud: Cloud) {
    this.storage.get(this.CLOUDS).then(clouds => {
      // clouds.forEach(el => {
      //   if(el.cloudID == cloud.cloudID) {
      //     el = cloud;
      //   }
      // })
      let cc = clouds as Array<Cloud>;
      for(var i = 0; i < clouds.length; i++) {
        if(cc[i].cloudID == cloud.cloudID) {
          cc[i] = cloud;
        }
      }
      this.setClouds(cc);
    })
  }

  calcAllBegEnd(inpCloud: Cloud = null) {
    if(!inpCloud) { /// do for all
      this.storage.get(this.CLOUDS).then(clouds => {
        if(clouds) {
          for(var i = 0; i < clouds.length; i++) {
            let curCloud = clouds[i] as Cloud;
            for(var j = 0; j < clouds[i].buildingBlocks.length; j++) {
              let curBlock = curCloud.buildingBlocks[j] as PatternBlock;
              let beg = 0;
              if(j == 0) {
                // set nothing
              }
              else {
                beg = curCloud.buildingBlocks[j-1].end;
              }
              let end = curBlock.height + beg;
              curBlock.beginning = beg; 
              curBlock.end = end; 
            }
            this.refreshCloud(curCloud);
          }
        }
      })
    }
    else { // do for only one
      for(var i = 0; i < inpCloud.buildingBlocks.length; i++) {
        let curBlock = inpCloud.buildingBlocks[i] as PatternBlock;
        let beg = 0;
        if(i == 0) {
          // set nothing
        }
        else {
          beg = inpCloud.buildingBlocks[i-1].end;
        }
        let end = curBlock.height + beg;
        curBlock.beginning = beg; 
        curBlock.end = end; 
      }
      this.refreshCloud(inpCloud);
    }
  }

  // BLOCKS
  getBlocksByCloudIdx(cloudIdx: number) {
    return this.storage.get(this.CLOUDS).then(clouds => {
      for(let i = 0; i < clouds.length; i++) {
        if(i == cloudIdx) {
          return clouds[i].buildingBlocks;
        }
      }
    })
  }

  addBlocksToAllClouds(block: PatternBlock) {
    this.storage.get(this.CLOUDS).then(clouds => {
      clouds.forEach(el => {
        let cloud: Cloud = el;
        cloud.buildingBlocks.push(block);
      })
      // this.storage.set(this.CLOUDS, clouds);
      this.setClouds(clouds);
    })
  }

  addBlockToCloud(cloudID: string, block: PatternBlock): Promise<void> {
    return this.storage.get(this.CLOUDS).then(clouds => {
      clouds.forEach(el => {
        let cloud: Cloud = el;
        if(cloud.cloudID == cloudID) {
          cloud.buildingBlocks.push(block);
        }
      })
      // this.storage.set(this.CLOUDS, clouds);
      this.setClouds(clouds).then(x => {
        this.calcAllBegEnd();
      });
    })
  }

  removeBlockFromCloud(cloudID: string, block: PatternBlock): Promise<void> {
    return this.storage.get(this.CLOUDS).then(clouds => {
      clouds.forEach(el => {
        let cloud: Cloud = el;
        if(cloud.cloudID == cloudID) {
          let idx = cloud.buildingBlocks.indexOf(block);
          cloud.buildingBlocks.splice(idx, 1);
          // this.storage.set(this.CLOUDS, clouds);
          this.setClouds(clouds);
        }
      })
    })
  }

  moveBlockBetweenClouds(oldCloudID: string, newCloudID: string, movingBlock: PatternBlock) {
    this.storage.get(this.CLOUDS).then(clouds => {
      clouds.forEach(el => {
        let cloud: Cloud = el;
        if(cloud.cloudID == newCloudID) { // add to new
          cloud.buildingBlocks.push(movingBlock);
        }
        if(cloud.cloudID == oldCloudID) { // remove from old
          cloud.buildingBlocks.splice(cloud.buildingBlocks.indexOf(movingBlock), 1);
        }
      })
      // this.storage.set(this.CLOUDS, clouds);
      this.setClouds(clouds);
    })
  }

  changeBlockName(blockID: string, newName: string) {
    this.storage.get(this.CLOUDS).then(clouds => {
      clouds.forEach(el => {
        let cloud: Cloud = el;
        cloud.buildingBlocks.forEach(block => {
          if(block.blockID == blockID) {
            block.name = newName;
          }
        })
      })
      // this.storage.set(this.CLOUDS, clouds);
      this.setClouds(clouds);
    })
  }

  changeBlockPatLet(blockID: string, newPatLet: string): Promise<any> {
    return this.storage.get(this.CLOUDS).then(clouds => {
      clouds.forEach(el => {
        let cloud: Cloud = el;
        cloud.buildingBlocks.forEach(block => {
          if(block.blockID == blockID) {
            block.blockPatLet = newPatLet;
          }
        })
      })
      // this.storage.set(this.CLOUDS, clouds);
      this.setClouds(clouds);
    })
  }

  changeBlockHeight(blockID: string, newHeight: number) {
    this.storage.get(this.CLOUDS).then(clouds => {
      clouds.forEach(el => {
        let cloud: Cloud = el;
        cloud.buildingBlocks.forEach(block => {
          if(block.blockID == blockID) {
            block.height = newHeight;
          }
        })
      })
      // this.storage.set(this.CLOUDS, clouds);
      this.setClouds(clouds);
    })
  }

  changeBlockBrightness(blockID: string, newB: number) {
    this.storage.get(this.CLOUDS).then(clouds => {
      clouds.forEach(el => {
        let cloud: Cloud = el;
        cloud.buildingBlocks.forEach(block => {
          if(block.blockID == blockID) {
            block.brightness = newB;
          }
        })
      })
      // this.storage.set(this.CLOUDS, clouds);
      this.setClouds(clouds);
    })
  }

}
