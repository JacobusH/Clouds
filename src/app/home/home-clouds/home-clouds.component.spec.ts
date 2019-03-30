import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCloudsComponent } from './home-clouds.component';

describe('HomeCloudsComponent', () => {
  let component: HomeCloudsComponent;
  let fixture: ComponentFixture<HomeCloudsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeCloudsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeCloudsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
