import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor'; 
import { UserService } from './services/user.service';

export function initializeApp(userService: UserService) {
  return () => {
    if (localStorage.getItem('token')) {
      return userService.validateToken();
    }
    return Promise.resolve();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor]) 
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [UserService],
      multi: true
    }
  ]
};
