import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewProductcodeComponent } from './preview-productcode.component';

describe('PreviewProductcodeComponent', () => {
  let component: PreviewProductcodeComponent;
  let fixture: ComponentFixture<PreviewProductcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewProductcodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewProductcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
