import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPacktypeComponent } from './add-packtype.component';

describe('AddPacktypeComponent', () => {
  let component: AddPacktypeComponent;
  let fixture: ComponentFixture<AddPacktypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPacktypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPacktypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
