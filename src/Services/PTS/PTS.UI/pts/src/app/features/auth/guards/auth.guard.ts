import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';
import {jwtDecode}  from 'jwt-decode';

export const authGuard: CanActivateFn = (route, state) => {

  const cookieService = inject(CookieService);
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getUser();

  // check for the JWT Token
  let token = cookieService.get('Authorization');

  if (token && user) {
    // check if the token is not expired : decode token
    token = token.replace('Bearer ', '');
    const decodedToken: any = jwtDecode(token);

    // check if the token has expired
    const expirationDate = decodedToken.exp * 1000;
    const currentTime = new Date().getTime();

    if (expirationDate < currentTime) {
      authService.logout();
      return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }
    else {
      // token is still valid
      if (user.roles.includes('ADMIN') || user.roles.includes('MANAGER') || user.roles.includes('READER')) {
        return true;
      } else {
        alert('unauthorized');
        return false;
      }
    }
  }
  else {
    // logout using auth service
    authService.logout();
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }

};
