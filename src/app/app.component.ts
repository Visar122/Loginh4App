import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { LoginServiceService } from './login-service.service';
import { login, signup } from '../interfaces';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule, HomeComponent],
})
export class AppComponent {
  title = 'h4LoginApp';
  isAuthenticated = false;
  userStatus: string | null = null;
  userName: string | null = null;

  SignupError = '';
  LoginError = '';
  UserCreated = '';

  // ✅ Toggle between Login and Sign-Up
  isSigningUp = false;

  // ✅ Define loginData
  loginData: login = {
    email: '',
    password: '',
  };

  // ✅ Define signUpData
  signUpData: signup = {
    name: '',
    email: '',
    password: '',
    cpr: '',
    status: 'user', // Default status is 'user'
  };

  constructor(private Userlogin: LoginServiceService, private route: Router) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      this.isAuthenticated = true;
      this.userName = userData.name;
      this.userStatus = userData.status;
    }
  }

  Login() {
    if (!this.loginData.email || !this.loginData.password) {
      this.LoginError = 'Please fill in all required fields';
      setTimeout(() => (this.LoginError = ''), 2000);
      return;
    }

    this.Userlogin.UserLogin(this.loginData).subscribe({
      next: (result) => {
        console.log('✅ Login Successful:', result);

        // ✅ Store user data in localStorage
        const userData = result.body;
        localStorage.setItem('user', JSON.stringify(userData));

        this.isAuthenticated = true;
        this.userStatus = userData.status;
        this.userName = userData.name;
       console.log('✅sdfs'+userData);
        // ✅ Redirect to Home Page after login
        this.route.navigate(['/home']);
      },
      error: (err) => {
        console.error('❌ Login Error:', err);
        this.LoginError = 'Login failed. Please try again.';
        setTimeout(() => (this.LoginError = ''), 3000);
      },
    });
  }

  SignUp() {
    if (!this.signUpData.name || !this.signUpData.email || !this.signUpData.password || !this.signUpData.cpr) {
        this.SignupError = 'Please fill in all required fields, including CPR';
        setTimeout(() => (this.SignupError = ''), 2000);
        return;
    }

    console.log(' Sending Sign-Up Request:', this.signUpData); // Debugging log

    this.Userlogin.UserSignUp(this.signUpData).subscribe({
        next: () => {
            console.log('✅ Sign-Up Successful!');
            this.UserCreated = 'Account Successfully Created';
            setTimeout(() => {
                this.UserCreated = '';
                this.isSigningUp = false;
            }, 1000);
        },
        error: (err) => {
            console.error('❌ Sign-Up API Error:', err);
            if (err.status === 409) {
                this.SignupError = 'User already exists';
            } else {
                this.SignupError = 'An error occurred during signup';
            }
            setTimeout(() => (this.SignupError = ''), 3000);
        }
    });
}

  }

