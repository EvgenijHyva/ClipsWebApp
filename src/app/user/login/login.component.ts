import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  creadentials: { email: string, password: string } = {
    email: '',
    password: ''
  }

  login() {
    console.log("login ",this.creadentials)
  }

}
