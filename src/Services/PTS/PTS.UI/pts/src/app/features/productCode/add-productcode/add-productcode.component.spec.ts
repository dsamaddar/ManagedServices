import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductCodeComponent } from './add-productcode.component';

describe('AddProductCodeComponent', () => {
  let component: AddProductCodeComponent;
  let fixture: ComponentFixture<AddProductCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProductCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProductCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
