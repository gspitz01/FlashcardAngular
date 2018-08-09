import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SecurityService } from '../security.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {
  currentUrl: string[] = [];
  
  constructor(private securityService: SecurityService,
              private router: Router) {}

  ngOnInit() {}
  
  logout() {
    this.securityService.logout();
    if (this.router.url !== "/home") {
      this.router.navigate(['login']);
    }
  }
  
  loggedIn(): boolean {
    return this.securityService.authenticated();
  }
  
  currentUser(): string {
    return this.securityService.currentUserDisplayName();
  }

}
