import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewCommonComponent } from './preview-common.component';

describe('PreviewCommonComponent', () => {
  let component: PreviewCommonComponent;
  let fixture: ComponentFixture<PreviewCommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewCommonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
