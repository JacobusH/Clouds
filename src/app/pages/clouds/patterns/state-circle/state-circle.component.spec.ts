import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateCircleComponent } from './state-circle.component';

describe('StateCircleComponent', () => {
  let component: StateCircleComponent;
  let fixture: ComponentFixture<StateCircleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StateCircleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StateCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
