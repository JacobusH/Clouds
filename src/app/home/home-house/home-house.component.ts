import { Component, OnInit, HostListener } from '@angular/core';
import { PageViewService } from '../../services/page-view.service';

@Component({
  selector: 'app-home-house',
  templateUrl: './home-house.component.html',
  styleUrls: ['./home-house.component.scss']
})
export class HomeHouseComponent implements OnInit {
  innerWidth;
  isWindowOpen = false;

  constructor(private pageViewService: PageViewService) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.pageViewService.isVisible$.subscribe(x => {
      this.isWindowOpen = x;
      console.log('hoem', x)
    })
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
