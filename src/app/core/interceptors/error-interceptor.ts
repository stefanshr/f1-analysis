import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private messageService: MessageService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 0) {
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Network error'});
          } else {
            this.messageService.add({severity: 'error', summary: `${error.status} - ${error.statusText}`, detail: error.message});
          }
          return throwError(() => error);
        })
      );
  }
}
