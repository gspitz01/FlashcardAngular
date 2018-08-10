import { TestBed, inject } from '@angular/core/testing';

import { AngularFireAuth } from 'angularfire2/auth';

import { SecurityService } from './security.service';

const angularFireAuthMock = {
  authState: {
    subscribe: (func) => {
      
    }
  }
} as AngularFireAuth;

describe('SecurityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SecurityService,
        { provide: AngularFireAuth, useValue: angularFireAuthMock }
      ]
    });
  });

  it('should be created', inject([SecurityService], (service: SecurityService) => {
    expect(service).toBeTruthy();
  }));
});
