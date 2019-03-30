import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeFlowersComponent } from './home-flowers.component';

describe('HomeFlowersComponent', () => {
  let component: HomeFlowersComponent;
  let fixture: ComponentFixture<HomeFlowersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeFlowersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeFlowersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
