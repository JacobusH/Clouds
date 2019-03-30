import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeHouseComponent } from './home-house.component';

describe('HomeHouseComponent', () => {
  let component: HomeHouseComponent;
  let fixture: ComponentFixture<HomeHouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeHouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
