import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { SecurityComponent } from './security.component';
import { SecurityService } from '../security.service';

const securityServiceMock = {
  authenticated: () => {
    return true;
  },
  
  currentUserDisplayName: () => {
    return "";
  }
} as SecurityService;

const routerMock = {
  
} as Router;

describe('SecurityComponent', () => {
  let component: SecurityComponent;
  let fixture: ComponentFixture<SecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SecurityComponent
      ],
      providers: [
        { provide: SecurityService, useValue: securityServiceMock },
        { provide: Router, useValue: routerMock }
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
