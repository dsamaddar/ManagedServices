import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoLayoutComponent } from './no-layout.component';

describe('NoLayoutComponent', () => {
  let component: NoLayoutComponent;
  let fixture: ComponentFixture<NoLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
