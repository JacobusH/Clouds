import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
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

}
