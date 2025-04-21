import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCodeListComponent } from './productcode-list.component';

describe('ProductCodeListComponent', () => {
  let component: ProductCodeListComponent;
  let fixture: ComponentFixture<ProductCodeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCodeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
