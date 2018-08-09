import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SecurityService } from '../security.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  return: string = "";

  constructor(private securityService: SecurityService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => this.return = params['return'] || 'home');
  }
  
  login() {
    this.securityService.login().then(() => {
      this.router.navigateByUrl(this.return);
    });
  }

}
