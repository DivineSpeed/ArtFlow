import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Inject Router service

  const token = sessionStorage.getItem('token');
  if (token) {
    return true; // Allow navigation if token is found
  } else {
    router.navigate(['/login']); // Redirect to login if no token
    return false; // Prevent navigation
  }
};
