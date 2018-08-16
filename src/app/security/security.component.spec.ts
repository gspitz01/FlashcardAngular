import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { SecurityComponent } from './security.component';
import { SecurityService } from '../security.service';

describe('SecurityComponent', () => {
  let component: SecurityComponent;
  let fixture: ComponentFixture<SecurityComponent>;
  let securityServiceSpy: jasmine.SpyObj<SecurityService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async(() => {
    const securitySpy = jasmine.createSpyObj("SecurityService", ["logout", "authenticated", "currentUserDisplayName"]);
    const routeSpy = jasmine.createSpyObj("Router", ["navigate"]);


    TestBed.configureTestingModule({
      declarations: [
        SecurityComponent
      ],
      providers: [
        { provide: SecurityService, useValue: securitySpy },
        { provide: Router, useValue: routeSpy }
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityComponent);
    component = fixture.componentInstance;
    securityServiceSpy = TestBed.get(SecurityService);
    routerSpy = TestBed.get(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call logout on SecurityService and navigate on Router on logout', () => {
    component.logout();
    expect(securityServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['login']);
  });

  it('should return SecurityService authenticated on loggedIn', () => {
    securityServiceSpy.authenticated.and.returnValue(true);
    expect(component.loggedIn()).toBeTruthy();
    expect(securityServiceSpy.authenticated).toHaveBeenCalled();
  });

  it('should return current user display name from SecurityService on currentUser', () => {
    const userName = "Jimmy 'Cracked' Corn";
    securityServiceSpy.currentUserDisplayName.and.returnValue(userName);
    expect(component.currentUser()).toBe(userName);
    expect(securityServiceSpy.currentUserDisplayName).toHaveBeenCalled();
  });
});
