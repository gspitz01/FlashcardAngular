import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';

import { AuthGuardService } from './auth-guard.service';
import { SecurityService } from './security.service';

const angularFireAuthMock = {
  
} as AngularFireAuth;

const securityServiceMock = {
  
} as SecurityService;

const routerMock = {
  
} as Router;

describe('AuthGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuardService,
        { provide: AngularFireAuth, useValue: angularFireAuthMock },
        { provide: SecurityService, useValue: securityServiceMock },
        { provide: Router, useValue: routerMock }
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });
  });

  it('should be created', inject([AuthGuardService], (service: AuthGuardService) => {
    expect(service).toBeTruthy();
  }));
});
