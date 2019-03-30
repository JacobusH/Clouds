import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeMountainsComponent } from './home-mountains.component';

describe('HomeMountainsComponent', () => {
  let component: HomeMountainsComponent;
  let fixture: ComponentFixture<HomeMountainsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeMountainsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeMountainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
