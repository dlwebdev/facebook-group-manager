import { TestBed, inject } from '@angular/core/testing';

import { UserAlertService } from './user-alert.service';

describe('UserAlertService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserAlertService]
    });
  });

  it('should be created', inject([UserAlertService], (service: UserAlertService) => {
    expect(service).toBeTruthy();
  }));
});
