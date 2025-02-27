import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { login, signup } from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  userisLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private route: Router) {}

  // ✅ User Signup
  UserSignUp(data: signup): Observable<any> {
    const newUser = { ...data, status: 'user' }; // Default status is user
    return this.http.post('https://localhost:7226/api/Logins/SignUp', newUser, { observe: 'response' }).pipe(
      catchError((error) => {
        if (error.status === 409) {
          return throwError(() => new Error('User already exists'));
        }
        return throwError(() => new Error('An error occurred during signup'));
      })
    );
  }

  // ✅ User Login
  UserLogin(data: login): Observable<any> {
    return this.http.get(`https://localhost:7226/api/Logins/Login?email=${data.email}&password=${data.password}`, { observe: 'response' }).pipe(
      catchError((error) => {
        if (error.status === 404) {
          return throwError(() => new Error('Invalid credentials'));
        }
        return throwError(() => new Error('Login failed'));
      })
    );
  }
}
