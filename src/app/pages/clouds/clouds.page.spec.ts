import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudsPage } from './clouds.page';

describe('CloudsPage', () => {
  let component: CloudsPage;
  let fixture: ComponentFixture<CloudsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloudsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
