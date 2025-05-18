import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewVersionComponent } from './preview-version.component';

describe('PreviewVersionComponent', () => {
  let component: PreviewVersionComponent;
  let fixture: ComponentFixture<PreviewVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewVersionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
