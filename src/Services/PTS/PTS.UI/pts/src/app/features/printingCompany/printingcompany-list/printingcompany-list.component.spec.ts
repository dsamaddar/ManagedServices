import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintingcompanyListComponent } from './printingcompany-list.component';

describe('PrintingcompanyListComponent', () => {
  let component: PrintingcompanyListComponent;
  let fixture: ComponentFixture<PrintingcompanyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintingcompanyListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintingcompanyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
