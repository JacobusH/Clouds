import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JetsteamComponent } from './jetsteam.component';

describe('JetsteamComponent', () => {
  let component: JetsteamComponent;
  let fixture: ComponentFixture<JetsteamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JetsteamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JetsteamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
