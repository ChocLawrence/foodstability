import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSubscriberComponent } from './modal-subscriber.component';

describe('ModalSubscriberComponent', () => {
  let component: ModalSubscriberComponent;
  let fixture: ComponentFixture<ModalSubscriberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalSubscriberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSubscriberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
