import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Inject Router service

  const token = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('role');

  if (token && role == "ADMIN") {
    return true; // Allow navigation if token is found
  } else if(!token){
    router.navigate(['/login']); // Redirect to login if no token
    return false; // Prevent navigation
  }
  else {
    router.navigate(['/notfound']);
    return false;

  }
};
