import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private authState: any = null;
  
  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(auth => {
      this.authState = auth;
    });
  }
  
  authenticated(): boolean {
    return this.authState !== null;
  }
  
  login() {
    return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  
  logout() {
    this.afAuth.auth.signOut();
  }
  
  currentUserAnonymous(): boolean {
    return this.authenticated() ? this.authState.isAnonymous : false;
  }
  
  currentUserId(): string {
    return this.authenticated() ? this.authState.uid : "";
  }
  
  currentUserDisplayName(): string {
    if (!this.authenticated()) {
      return "Guest";
    } else if (this.currentUserAnonymous()) {
      return "Anonymous";
    } else {
      return this.authState['displayName'] || "User without a name";
    }
  }
}
