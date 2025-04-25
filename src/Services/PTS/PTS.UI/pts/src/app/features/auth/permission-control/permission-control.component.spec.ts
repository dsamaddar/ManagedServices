import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionControlComponent } from './permission-control.component';

describe('PermissionControlComponent', () => {
  let component: PermissionControlComponent;
  let fixture: ComponentFixture<PermissionControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissionControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
