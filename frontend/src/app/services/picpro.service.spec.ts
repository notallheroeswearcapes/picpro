import { TestBed } from '@angular/core/testing';

import { PicproService } from './picpro.service';

describe('PicproService', () => {
  let service: PicproService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PicproService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
