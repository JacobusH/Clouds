import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePowerComponent } from './home-power.component';

describe('HomePowerComponent', () => {
  let component: HomePowerComponent;
  let fixture: ComponentFixture<HomePowerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePowerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
