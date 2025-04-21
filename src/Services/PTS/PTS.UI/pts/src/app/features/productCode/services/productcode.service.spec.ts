import { TestBed } from '@angular/core/testing';

import { ProductCodeService } from './productcode.service';

describe('ProductCodeService', () => {
  let service: ProductCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
