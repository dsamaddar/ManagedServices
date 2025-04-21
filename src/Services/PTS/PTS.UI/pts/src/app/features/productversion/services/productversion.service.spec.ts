import { TestBed } from '@angular/core/testing';

import { ProductversionService } from './productversion.service';

describe('ProductversionService', () => {
  let service: ProductversionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductversionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
