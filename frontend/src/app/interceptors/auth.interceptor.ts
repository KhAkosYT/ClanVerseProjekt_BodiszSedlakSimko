import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { UserService } from "../services/user.service";
import { catchError, throwError } from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('token');
    const userService = inject(UserService);

    let authReq = req;

    if (token) {
        authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(authReq).pipe(
        catchError((error) => {
            if (error.status === 401) {
                localStorage.removeItem('token');
                userService.triggerAuthError();
            }
            return throwError(() => error);
        })
    );
}
