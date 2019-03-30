import { Component, OnInit } from '@angular/core';
import { PageViewService } from 'src/app/services/page-view.service';

@Component({
  selector: 'app-home-clouds',
  templateUrl: './home-clouds.component.html',
  styleUrls: ['./home-clouds.component.scss']
})
export class HomeCloudsComponent implements OnInit {

  constructor(private pageViewService: PageViewService) { 
PageViewService
  }

  ngOnInit() {
  }

  togglePageView(val: boolean) {
    if(val) {
      this.pageViewService.setVisibleTrue();
    }
    else {
      this.pageViewService.setVisibleFalse();
    }
  }
}
