import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewBarcodeComponent } from './preview-barcode.component';

describe('PreviewBarcodeComponent', () => {
  let component: PreviewBarcodeComponent;
  let fixture: ComponentFixture<PreviewBarcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewBarcodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewBarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
