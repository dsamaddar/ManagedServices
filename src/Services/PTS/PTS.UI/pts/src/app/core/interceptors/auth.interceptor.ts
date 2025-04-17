import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieOptions, CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.cookieService.get('Authorization'); // or from a service
    console.log('Interceptor is called');
    if (token) {
      const clonedReq = req.clone({
        setHeaders: {
          'Authorization': token
        }
      });
      console.log('interceptor fired.');
      return next.handle(clonedReq);
    }

    return next.handle(req);
  }
}
