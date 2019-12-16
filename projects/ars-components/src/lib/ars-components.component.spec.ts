import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArsComponentsComponent } from './ars-components.component';

describe('ArsComponentsComponent', () => {
  let component: ArsComponentsComponent;
  let fixture: ComponentFixture<ArsComponentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArsComponentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArsComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
