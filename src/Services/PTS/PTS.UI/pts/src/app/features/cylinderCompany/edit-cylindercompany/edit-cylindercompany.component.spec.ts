import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCylindercompanyComponent } from './edit-cylindercompany.component';

describe('EditCylindercompanyComponent', () => {
  let component: EditCylindercompanyComponent;
  let fixture: ComponentFixture<EditCylindercompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCylindercompanyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCylindercompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
