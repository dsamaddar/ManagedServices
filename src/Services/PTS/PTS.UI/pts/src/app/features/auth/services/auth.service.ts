import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginResponse } from '../models/login-response.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { parseJsonSourceFileConfigFileContent } from 'typescript';
import { User } from '../models/user.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  $user = new BehaviorSubject<User | undefined>(undefined);

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  // login(request: LoginRequest): Observable<LoginResponse>{
  //   return this.http.post<LoginResponse>(`${environment.apiBaseUrl}/api/auth/login`,{
  //     email : request.email,
  //     password: request.password
  //   })
  // }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiBaseUrl}/api/auth/login`, {
      email: request.email,
      password: request.password
    }).pipe(
      tap(response => {
        this.setTokens(response.accessToken, response.refreshToken);
      })
    );
  }

  setUser(user: User): void{
    this.$user.next(user);
    localStorage.setItem('user-id',user.userid);
    localStorage.setItem('user-email',user.email);
    localStorage.setItem('user-roles',user.roles.join(','));
  }

  user() : Observable<User | undefined>{
    return this.$user.asObservable();
  }

  getUser(): User | undefined {
    const userid = localStorage.getItem('user-id');
    const email = localStorage.getItem('user-email');
    const roles = localStorage.getItem('user-roles');

    if(email && roles){
      const user: User ={
        userid: String(userid),
        email: email,
        roles: roles?.split(',')
      }

      return user;
    }

    return undefined;

  }

  logout(): void{
    localStorage.clear();
    this.cookieService.delete('Authorization','/');
    this.$user.next(undefined);
  }

  register(userData: { email: string, password: string }): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/api/auth/register`, userData);
  }

  forgotPassword(email: string, ClientURI: string) {
    console.log(email);
    console.log(ClientURI);
    return this.http.post(`${environment.apiBaseUrl}/api/auth/forgot-password`, { email, ClientURI });
  }
  
  resetPassword(email: string,token: string, newPassword: string) {
    return this.http.post(`${environment.apiBaseUrl}/api/auth/reset-password`, {
      email,
      token,
      newPassword
    });
  }

  getAccessToken(): string | null {
    return this.cookieService.get('Authorization') || null;
  }
  
  getRefreshToken(): string | null {
    return this.cookieService.get('refresh_token') || null;
  }
  
  setTokens(accessToken: string, refreshToken: string): void {
    this.cookieService.set('Authorization', accessToken, { path: '/' });
    this.cookieService.set('refresh_token', refreshToken, { path: '/' });
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return new Observable(observer => {
        observer.error('No refresh token');
      });
    }
    
    console.log('Refresh Token Generated');
    return this.http.post<LoginResponse>(`${environment.apiBaseUrl}/api/auth/refresh-token`, {
      refreshToken
    });
  }

}
