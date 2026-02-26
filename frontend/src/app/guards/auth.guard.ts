import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserService } from '../services/user.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const userService = inject(UserService);

  return userService.validateToken().pipe(
    map(res => {
      if (res) return true;
      return false;
    })
  );
};
