import { Component, OnInit } from '@angular/core';
import { PageViewService } from '../../services/page-view.service';

@Component({
  selector: '[app-home-clouds]',
  templateUrl: './home-clouds.component.html',
  styleUrls: ['./home-clouds.component.scss']
})
export class HomeCloudsComponent implements OnInit {

  constructor(private pageViewService: PageViewService) { 

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
