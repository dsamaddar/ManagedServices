import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductversionComponent } from './add-productversion.component';

describe('AddProductversionComponent', () => {
  let component: AddProductversionComponent;
  let fixture: ComponentFixture<AddProductversionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProductversionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProductversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
