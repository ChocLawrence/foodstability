import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenaccessComponent } from './openaccess.component';

describe('OpenaccessComponent', () => {
  let component: OpenaccessComponent;
  let fixture: ComponentFixture<OpenaccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenaccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenaccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
