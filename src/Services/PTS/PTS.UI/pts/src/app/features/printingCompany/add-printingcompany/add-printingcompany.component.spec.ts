import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPrintingcompanyComponent } from './add-printingcompany.component';

describe('AddPrintingcompanyComponent', () => {
  let component: AddPrintingcompanyComponent;
  let fixture: ComponentFixture<AddPrintingcompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPrintingcompanyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPrintingcompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
