import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPlanModalComponent } from './new-plan-modal.component';

describe('NewPlanModalComponent', () => {
  let component: NewPlanModalComponent;
  let fixture: ComponentFixture<NewPlanModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPlanModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPlanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
