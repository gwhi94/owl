import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetDateModalComponent } from './set-date-modal.component';

describe('SetDateModalComponent', () => {
  let component: SetDateModalComponent;
  let fixture: ComponentFixture<SetDateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetDateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetDateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
