import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndPlanModalComponent } from './end-plan-modal.component';

describe('EndPlanModalComponent', () => {
  let component: EndPlanModalComponent;
  let fixture: ComponentFixture<EndPlanModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndPlanModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndPlanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
