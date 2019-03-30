import { Component, OnInit, HostListener } from '@angular/core';
import { PageViewService } from 'src/app/services/page-view.service';

@Component({
  selector: 'app-home-house',
  templateUrl: './home-house.component.html',
  styleUrls: ['./home-house.component.scss']
})
export class HomeHouseComponent implements OnInit {
  innerWidth;

  constructor(private pageViewService: PageViewService) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  togglePageView(val: boolean) {
    if(val) {
      this.pageViewService.setVisibleTrue();
    }
    else {
      this.pageViewService.setVisibleFalse();
    }
  }

  getHouseWidth() {
    return "30%";
  }

}
