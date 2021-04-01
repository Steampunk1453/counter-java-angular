import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';

import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {ToastrService} from 'ngx-toastr';
import {HttpError} from '../../data/dto/http-error';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  constructor(private toastService: ToastrService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.status && event.statusText) {
            const message = `Action executed successfully: ${event.statusText}`;
            this.toastService.success(message);
          }
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        let httpError: HttpError;
        httpError = {
          code: error && error.error && error.error.errorCode ? error.error.errorCode : '',
          message: error && error.error && error.error.message ? error.error.message : '',
          status: error.status
        };
        this.toastService.error(httpError.code, httpError.message);
        return throwError(error);
      }));
  }

}
