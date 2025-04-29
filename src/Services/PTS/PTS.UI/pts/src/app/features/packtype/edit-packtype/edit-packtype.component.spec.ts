import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPacktypeComponent } from './edit-packtype.component';

describe('EditPacktypeComponent', () => {
  let component: EditPacktypeComponent;
  let fixture: ComponentFixture<EditPacktypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPacktypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPacktypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
