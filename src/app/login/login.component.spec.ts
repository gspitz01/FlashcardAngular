import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { LoginComponent } from './login.component';
import { SecurityService } from '../security.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let securityServiceSpy: jasmine.SpyObj<SecurityService>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let routerSpy: jasmine.SpyObj<Router>;
  const fakeQueryParamsWithReturn = {
    return: "categories"
  }

  beforeEach(async(() => {
    const ssSpy = jasmine.createSpyObj("SecurityService", ["login"]);
    const arSpy = jasmine.createSpyObj("ActivatedRoute", ["queryParams"]);
    const rSpy = jasmine.createSpyObj("Router", ["navigateByUrl"]);
    arSpy.queryParams = jasmine.createSpyObj("Observable<Params>", ["subscribe"]);
    arSpy.queryParams.subscribe.and.callFake(func => {
        func(fakeQueryParamsWithReturn);
    });

    TestBed.configureTestingModule({
      declarations: [
        LoginComponent
      ],
      providers: [
        { provide: ActivatedRoute, useValue: arSpy },
        { provide: SecurityService, useValue: ssSpy },
        { provide: Router, useValue: rSpy }
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    securityServiceSpy = TestBed.get(SecurityService);
    activatedRouteSpy = TestBed.get(ActivatedRoute);
    routerSpy = TestBed.get(Router);
    fixture.detectChanges();
  });

  it('should create and get return from route.queryParams', () => {
    expect(component).toBeTruthy();
    expect(component.return).toBe(fakeQueryParamsWithReturn.return);
    expect(activatedRouteSpy.queryParams.subscribe).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('should call login on SecurityService and navigate with router on login', () => {
    const fauxPromise = {
      then: (func) => {
        func();
      }
    };
    securityServiceSpy.login.and.returnValue(fauxPromise);
    component.login();
    expect(securityServiceSpy.login).toHaveBeenCalled();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(fakeQueryParamsWithReturn.return);
  });
});
