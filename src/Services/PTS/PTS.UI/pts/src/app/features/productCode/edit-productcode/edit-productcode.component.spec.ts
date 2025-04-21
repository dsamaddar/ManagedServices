import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductCodeComponent } from './edit-productcode.component';

describe('EditProductCodeComponent', () => {
  let component: EditProductCodeComponent;
  let fixture: ComponentFixture<EditProductCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProductCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProductCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
