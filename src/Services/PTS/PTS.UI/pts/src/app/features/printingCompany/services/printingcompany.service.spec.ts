import { TestBed } from '@angular/core/testing';

import { PrintingcompanyService } from './printingcompany.service';

describe('PrintingcompanyService', () => {
  let service: PrintingcompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintingcompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
