import { Component, OnInit, HostListener} from '@angular/core';
import { ScannerService } from '../../services/scanner.service';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { PatternsService } from '../../services/patterns.service';

 
@Component({ 
  selector: '[app-home-power]',
  templateUrl: './home-power.component.html',
  styleUrls: ['./home-power.component.scss']
})
export class HomePowerComponent implements OnInit {
  innerWidth;

  constructor(private scannerService: ScannerService
    , private router: Router
    , private patternService: PatternsService) { 

    }
 
  ngOnInit() { 
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  onTap(event) {
    console.log("tapped")
    this.scannerService.setShowSettingsFalse();
    this.router.navigateByUrl('/home/scanner', { queryParams: { 'isShort': 'true' }} )
    // this.isWindowOpen = true;
  }

  onPress(event) {
    // console.log("held")
    this.scannerService.setShowSettingsTrue();
    this.router.navigateByUrl('/home/scanner', { queryParams: { 'isShort': 'false' }} )
    // this.isWindowOpen = true;
  }

  flipPower(flipTo: string) {
    if(flipTo == 'off') {
      this.patternService.sendPattern(0, 'Z', 10);
    }
    else { // to 'on'
      this.patternService.sendPattern(0, 'Y', 100);
    }
  }

  getPowerWidth() {
    // console.log(window.innerWidth);
    if(window.innerWidth > 360) {
      return "25%";
    }
    else {
      return "47%";
    }
  }

  getOneBottom() {
    if(window.innerWidth < 400) {
      return "56px";
    }
    else {
      return "280px";
    }
  }
  getOneLeft() {
    if(window.innerWidth < 400) {
      return "90px";
    }
    else {
      return "150px";
    }
  }
  getTwoBottom() {
    if(window.innerWidth < 400) {
      return "71px";
    }
    else {
      return "150px";
    }
  }
  getTwoLeft() {
    if(window.innerWidth < 400) {
      return "118px";
    }
    else {
      return "150px";
    }
  }
  getThreeBottom() {
    if(window.innerWidth < 400) {
      return "49px";
    }
    else {
      return "150px";
    }
  }
  getThreeLeft() {
    if(window.innerWidth < 400) {
      return "137px";
    }
    else {
      return "150px";
    }
  }

}
