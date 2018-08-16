import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';

import { AuthGuardService } from './auth-guard.service';
import { SecurityService } from './security.service';

describe('AuthGuardService', () => {
  let securityServiceSpy: jasmine.SpyObj<SecurityService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authGuardService: AuthGuardService;
  const route = new ActivatedRouteSnapshot();
  const state = {
    url: "FakeURL"
  } as RouterStateSnapshot;

  beforeEach(() => {
    const securitySpy = jasmine.createSpyObj("SecurityService", ["authenticated"]);
    const routeSpy = jasmine.createSpyObj("Router", ["navigate"]);

    TestBed.configureTestingModule({
      providers: [
        AuthGuardService,
        { provide: SecurityService, useValue: securitySpy },
        { provide: Router, useValue: routeSpy }
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });

    authGuardService = TestBed.get(AuthGuardService);
    securityServiceSpy = TestBed.get(SecurityService);
    routerSpy = TestBed.get(Router);
  });

  it('should be created', () => {
    expect(authGuardService).toBeTruthy();
  });

  it('should return false and navigate to login on Router on canActivate with authenticated false', () => {
    securityServiceSpy.authenticated.and.returnValue(false);
    expect(authGuardService.canActivate(route, state)).toBeFalsy();
    expect(securityServiceSpy.authenticated).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['login'], jasmine.any(Object));
  });

  it('should return true on canActivate with authenticated true', () => {
    securityServiceSpy.authenticated.and.returnValue(true);
    expect(authGuardService.canActivate(route, state)).toBeTruthy();
    expect(securityServiceSpy.authenticated).toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
