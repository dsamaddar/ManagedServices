import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPrintingcompanyComponent } from './edit-printingcompany.component';

describe('EditPrintingcompanyComponent', () => {
  let component: EditPrintingcompanyComponent;
  let fixture: ComponentFixture<EditPrintingcompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPrintingcompanyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPrintingcompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
