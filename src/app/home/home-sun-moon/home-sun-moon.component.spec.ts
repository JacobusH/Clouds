import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSunMoonComponent } from './home-sun-moon.component';

describe('HomeSunMoonComponent', () => {
  let component: HomeSunMoonComponent;
  let fixture: ComponentFixture<HomeSunMoonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeSunMoonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeSunMoonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
