import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeRainbowComponent } from './home-rainbow.component';

describe('HomeRainbowComponent', () => {
  let component: HomeRainbowComponent;
  let fixture: ComponentFixture<HomeRainbowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeRainbowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeRainbowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
