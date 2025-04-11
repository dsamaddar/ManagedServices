import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCylindercompanyComponent } from './add-cylindercompany.component';

describe('AddCylindercompanyComponent', () => {
  let component: AddCylindercompanyComponent;
  let fixture: ComponentFixture<AddCylindercompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCylindercompanyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCylindercompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
