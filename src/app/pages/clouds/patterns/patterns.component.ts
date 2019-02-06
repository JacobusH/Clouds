import { Component, OnInit, NgZone, OnDestroy, Output } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { DeviceService } from '../../../modules/shared/services/device.service';
import { PatternsService } from '../../../modules/shared/services/patterns.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PatternsEnum } from '../../../modules/shared/models/patterns.model';

@Component({
  selector: 'app-patterns',
  templateUrl: './patterns.component.html',
  styleUrls: ['./patterns.component.scss']
})
export class PatternsComponent implements OnInit {
  displayMsg: string = 'Hallo';
  cloud1_interval = 100;
  cloud2_interval = 100;
  cloud3_interval = 100;

  buttons1 = [
    { cloudNum: 1, pattern: 'rainbow', isClicked: false },
    { cloudNum: 1, pattern: 'theater', isClicked: false },
    { cloudNum: 1, pattern: 'colorwipe', isClicked: false },
    { cloudNum: 1, pattern: 'scanner', isClicked: false },
    { cloudNum: 1, pattern: 'fade', isClicked: false }
  ]
  buttons2 = [
    { cloudNum: 2, pattern: 'rainbow', isClicked: false },
    { cloudNum: 2, pattern: 'theater', isClicked: false },
    { cloudNum: 2, pattern: 'colorwipe', isClicked: false },
    { cloudNum: 2, pattern: 'scanner', isClicked: false },
    { cloudNum: 2, pattern: 'fade', isClicked: false }
  ]
  buttons3 = [
    { cloudNum: 3, pattern: 'rainbow', isClicked: false },
    { cloudNum: 3, pattern: 'theater', isClicked: false },
    { cloudNum: 3, pattern: 'colorwipe', isClicked: false },
    { cloudNum: 3, pattern: 'scanner', isClicked: false },
    { cloudNum: 3, pattern: 'fade', isClicked: false }
  ]

  constructor(private ble: BLE,
    private ngZone: NgZone
    , private deviceService: DeviceService
    , private router: Router
    , private actRoute: ActivatedRoute
    , private patternService: PatternsService) {

}

  ngOnInit() {

  }

  sendCmd(letter: string) {
    this.patternService.sendCommand(letter).then(
      (info) => {
        this.displayMsg = 'Sent cmd' + letter + " | info: " + info; 
      },
      (err) => {
        this.displayMsg = 'Err sending cmd' + letter + " | err: " + err; 
      }
    )
  }

  selectThis(cloud: any, btnIdx: number, cloudNum: number) {
    if(cloudNum == 1) {
      this.buttons1.forEach(button => button.isClicked = false)
      this.buttons1[btnIdx].isClicked = true;
      this.patternService.sendPattern(cloudNum, cloud.pattern, this.cloud1_interval)
    }
    else if(cloudNum == 2) {
      this.buttons2.forEach(button => button.isClicked = false)
      this.buttons2[btnIdx].isClicked = true;
      this.patternService.sendPattern(cloudNum, cloud.pattern, this.cloud2_interval)
    }
    else if(cloudNum == 3) {
      this.buttons3.forEach(button => button.isClicked = false)
      this.buttons3[btnIdx].isClicked = true;
      this.patternService.sendPattern(cloudNum, cloud.pattern, this.cloud3_interval)
    }
  }

  changeInterval(cloudNum: number) {
    if(cloudNum == 1) {
      this.buttons1.forEach(cloud => {
        if(cloud.isClicked) {
          this.patternService.sendPattern(cloudNum, cloud.pattern, this.cloud1_interval)
        }
      })
    }
    else if(cloudNum == 2) {
      this.buttons2.forEach(cloud => {
        if(cloud.isClicked) {
          this.patternService.sendPattern(cloudNum, cloud.pattern, this.cloud2_interval)
        }
      })
    }
    if(cloudNum == 3) {
      this.buttons3.forEach(cloud => {
        if(cloud.isClicked) {
          this.patternService.sendPattern(cloudNum, cloud.pattern, this.cloud3_interval)
        }
      })
    }
  }

  computeClass(cloud: any) {
    if (cloud.isClicked) {
      return 'cloud-btn active';
    } else {
      return 'cloud-btn inactive';
    }
  }

}
