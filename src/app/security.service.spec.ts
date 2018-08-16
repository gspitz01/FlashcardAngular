import { TestBed, inject } from '@angular/core/testing';

import { AngularFireAuth } from 'angularfire2/auth';
import { User } from 'firebase/app';

import { SecurityService } from './security.service';

describe('SecurityService', () => {
  let securityService: SecurityService;
  let angularFireAuthSpy: jasmine.SpyObj<AngularFireAuth>;
  const fakeAuthState = {
    isAnonymous: true,
    uid: "UID"
  };

  beforeEach(() => {
    const afaSpy = jasmine.createSpyObj("AngularFireAuth", ["authState", "auth"]);
    afaSpy.authState = jasmine.createSpyObj("User", ["subscribe"]);
    afaSpy.authState.subscribe.and.callFake((func) => {
      func(fakeAuthState);
    });
    afaSpy.auth = jasmine.createSpyObj("FirebaseAuth", ["signInWithPopup", "signOut"]);

    TestBed.configureTestingModule({
      providers: [
        SecurityService,
        { provide: AngularFireAuth, useValue: afaSpy }
      ]
    });

    securityService = TestBed.get(SecurityService);
    angularFireAuthSpy = TestBed.get(AngularFireAuth);
  });

  it('should be created and call subscribe on authState', () => {
    expect(securityService).toBeTruthy();
    expect(angularFireAuthSpy.authState.subscribe).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('should return true on authenticated', () => {
    expect(securityService.authenticated()).toBeTruthy();
  });

  it('should return false on authenticated when authState creates null', () => {
    const aSpy = jasmine.createSpyObj("AngularFireAuth", ["authState"]);
    aSpy.authState = jasmine.createSpyObj("User", ["subscribe"]);
    aSpy.authState.subscribe.and.callFake((func) => {
      func(null);
    });
    const otherSecurityService = new SecurityService(aSpy);
    expect(otherSecurityService.authenticated()).toBeFalsy();
  });

  it('should call signInWithPopup on login', () => {
    securityService.login();
    expect(angularFireAuthSpy.auth.signInWithPopup).toHaveBeenCalledWith(jasmine.any(Object));
  });

  it('should call signOut on logout', () => {
    securityService.logout();
    expect(angularFireAuthSpy.auth.signOut).toHaveBeenCalled();
  });

  it('should return authState.isAnonymous on currentUserAnonymous with authenticated true', () => {
    // Authenticated is true because angularFireAuthSpy.authState creates a non-null value
    expect(securityService.currentUserAnonymous()).toBe(fakeAuthState.isAnonymous);
  });

  it('should return false on currentUserAnonymous with authenticated false', () => {
    // Create false situation for authenticated
    const aSpy = jasmine.createSpyObj("AngularFireAuth", ["authState"]);
    aSpy.authState = jasmine.createSpyObj("User", ["subscribe"]);
    aSpy.authState.subscribe.and.callFake((func) => {
      func(null);
    });
    const otherSecurityService = new SecurityService(aSpy);
    expect(otherSecurityService.currentUserAnonymous()).toBeFalsy();
  });

  it('should return authState.uid on currentUserId with authenticated true', () => {
    // Authenticated is true because angularFireAuthSpy.authState creates a non-null value
    expect(securityService.currentUserId()).toBe(fakeAuthState.uid);
  });

  it('should return empty string on currentUserId with authenticated false', () => {
    // Create false situation for authenticated
    const aSpy = jasmine.createSpyObj("AngularFireAuth", ["authState"]);
    aSpy.authState = jasmine.createSpyObj("User", ["subscribe"]);
    aSpy.authState.subscribe.and.callFake((func) => {
      func(null);
    });
    const otherSecurityService = new SecurityService(aSpy);
    expect(otherSecurityService.currentUserId()).toBe("");
  });

  it('should return "Anonymous" on currentUserDisplayName with authenticated true and anonymous true', () => {
    expect(securityService.currentUserDisplayName()).toBe("Anonymous");
  });

  it('should retun "Guest" on currentUserDisplayName with authenticated false', () => {
    // Create false situation for authenticated
    const aSpy = jasmine.createSpyObj("AngularFireAuth", ["authState"]);
    aSpy.authState = jasmine.createSpyObj("User", ["subscribe"]);
    aSpy.authState.subscribe.and.callFake((func) => {
      func(null);
    });
    const otherSecurityService = new SecurityService(aSpy);
    expect(otherSecurityService.currentUserDisplayName()).toBe("Guest");
  });

  it('should return authState.displayName on currentUserDisplayName with authenticated true and anonymous false', () => {
    // Create true authenticated and false anonymous
    const fauxAuthState = {
      isAnonymous: false,
      uid: "Whatever",
      displayName: "Display Name"
    }
    const aSpy = jasmine.createSpyObj("AngularFireAuth", ["authState"]);
    aSpy.authState = jasmine.createSpyObj("User", ["subscribe"]);
    aSpy.authState.subscribe.and.callFake((func) => {
      func(fauxAuthState);
    });
    const otherSecurityService = new SecurityService(aSpy);
    expect(otherSecurityService.currentUserDisplayName()).toBe(fauxAuthState.displayName);
  });

  it('should return "User without a name" on currentUserDisplayName with authenticated true, anonymous false and no displayName', () => {
    // Create true authenticated and false anonymous
    const fauxAuthState = {
      isAnonymous: false,
      uid: "Whatever"
    }
    const aSpy = jasmine.createSpyObj("AngularFireAuth", ["authState"]);
    aSpy.authState = jasmine.createSpyObj("User", ["subscribe"]);
    aSpy.authState.subscribe.and.callFake((func) => {
      func(fauxAuthState);
    });
    const otherSecurityService = new SecurityService(aSpy);
    expect(otherSecurityService.currentUserDisplayName()).toBe("User without a name");
  });
});
