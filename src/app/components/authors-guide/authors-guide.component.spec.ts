import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorsGuideComponent } from './authors-guide.component';

describe('AuthorsGuideComponent', () => {
  let component: AuthorsGuideComponent;
  let fixture: ComponentFixture<AuthorsGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorsGuideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorsGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
