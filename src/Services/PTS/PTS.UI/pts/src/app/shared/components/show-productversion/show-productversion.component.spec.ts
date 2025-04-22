import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowProductversionComponent } from './show-productversion.component';

describe('ShowProductversionComponent', () => {
  let component: ShowProductversionComponent;
  let fixture: ComponentFixture<ShowProductversionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowProductversionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowProductversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
