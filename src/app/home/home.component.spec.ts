import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { LoginServiceService } from '../login-service.service';
import { AppComponent } from '../app.component';

describe('AppComponent (Login and Signup)', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let loginService: jasmine.SpyObj<LoginServiceService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('LoginServiceService', ['UserLogin', 'UserSignUp']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule],
      declarations: [AppComponent],
      providers: [{ provide: LoginServiceService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    loginService = TestBed.inject(LoginServiceService) as jasmine.SpyObj<LoginServiceService>;
  });

  it('should login and store user data in localStorage', () => {
    const mockUserData = {
      UserID: 1,
      Name: 'John Doe',
      Email: 'john@example.com',
      Status: 'User'
    };

    loginService.UserLogin.and.returnValue(of({ status: 200, body: mockUserData }));

    component.loginData.email = 'john@example.com';
    component.loginData.password = 'SecurePass123!';
    component.Login();

    expect(loginService.UserLogin).toHaveBeenCalledWith(component.loginData);
    expect(localStorage.getItem('user')).toEqual(JSON.stringify(mockUserData));
    expect(component.isAuthenticated).toBeTrue();
    expect(component.userName).toBe('John Doe');
    expect(component.userStatus).toBe('User');
  });

  it('should handle login errors', () => {
    loginService.UserLogin.and.returnValue(throwError(() => new Error('Invalid credentials')));

    component.loginData.email = 'john@example.com';
    component.loginData.password = 'WrongPassword';
    component.Login();

    expect(loginService.UserLogin).toHaveBeenCalled();
    expect(component.LoginError).toBe('Login failed. Please try again.');
  });

  it('should sign up successfully', () => {
    loginService.UserSignUp.and.returnValue(of({ status: 200 }));

    component.signUpData.name = 'John Doe';
    component.signUpData.email = 'john@example.com';
    component.signUpData.password = 'SecurePass123!';
    component.SignUp();

    expect(loginService.UserSignUp).toHaveBeenCalled();
    expect(component.UserCreated).toBe('Account Successfully Created');
    expect(component.isSigningUp).toBeFalse();
  });

  it('should handle signup errors', () => {
    loginService.UserSignUp.and.returnValue(throwError(() => new Error('User already exists')));

    component.signUpData.name = 'John Doe';
    component.signUpData.email = 'john@example.com';
    component.signUpData.password = 'SecurePass123!';
    component.SignUp();

    expect(loginService.UserSignUp).toHaveBeenCalled();
    expect(component.SignupError).toBe('User with this Name or Email already exists');
  });
});
