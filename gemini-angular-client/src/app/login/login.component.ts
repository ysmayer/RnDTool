// login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  apiKey: string = '';

  constructor(private configService: ConfigService, private router: Router) {}

  submit() {
    this.configService.setApiKey(this.apiKey);
    this.router.navigate(['/']);
  }
}