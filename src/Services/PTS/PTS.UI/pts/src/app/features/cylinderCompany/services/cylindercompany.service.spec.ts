import { TestBed } from '@angular/core/testing';

import { CylindercompanyService } from './cylindercompany.service';

describe('CylindercompanyService', () => {
  let service: CylindercompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CylindercompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
