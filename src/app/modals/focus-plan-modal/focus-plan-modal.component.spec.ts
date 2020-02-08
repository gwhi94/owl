import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FocusPlanModalComponent } from './focus-plan-modal.component';

describe('FocusPlanModalComponent', () => {
  let component: FocusPlanModalComponent;
  let fixture: ComponentFixture<FocusPlanModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FocusPlanModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FocusPlanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
