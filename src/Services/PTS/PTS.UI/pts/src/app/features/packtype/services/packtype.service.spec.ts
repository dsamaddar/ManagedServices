import { TestBed } from '@angular/core/testing';

import { PacktypeService } from './packtype.service';

describe('PacktypeService', () => {
  let service: PacktypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PacktypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
