import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CylindercompanyListComponent } from './cylindercompany-list.component';

describe('CylindercompanyListComponent', () => {
  let component: CylindercompanyListComponent;
  let fixture: ComponentFixture<CylindercompanyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CylindercompanyListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CylindercompanyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
