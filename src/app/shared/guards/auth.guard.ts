import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

export const authGuard: CanActivateFn = (route, state) => {

  const userService = inject(UserService);
  const router = inject(Router);
  const isAuth: boolean = false;
  const isSessionStorageLogin = !!sessionStorage.getItem('login')
  let isAuthResult: boolean = false
  console.log('isAuth', isAuth)
  if (!isSessionStorageLogin) {
    const isAuth = !!userService.getUser();
    if (!isAuth) {
      router.navigate(['auth']);
    }
  }
  
  if (isSessionStorageLogin || isAuthResult) {
    isAuthResult = true;
  }
  
  return isAuthResult;
};
