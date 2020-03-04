import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPaymentModalComponent } from './new-payment-modal.component';

describe('NewPaymentModalComponent', () => {
  let component: NewPaymentModalComponent;
  let fixture: ComponentFixture<NewPaymentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPaymentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPaymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
