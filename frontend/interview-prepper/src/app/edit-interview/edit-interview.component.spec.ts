import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInterviewComponent } from './edit-interview.component';

describe('EditInterviewComponent', () => {
  let component: EditInterviewComponent;
  let fixture: ComponentFixture<EditInterviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditInterviewComponent]
    });
    fixture = TestBed.createComponent(EditInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
