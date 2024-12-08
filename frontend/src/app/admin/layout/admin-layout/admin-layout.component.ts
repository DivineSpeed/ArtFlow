import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

interface NavItem {
  route: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
})
export class AdminLayoutComponent implements OnInit {
  pageTitle: string = 'Dashboard';

  navItems: NavItem[] = [
    {
      route: '/admin/dashboard',
      label: 'Dashboard',
      icon: 'dashboard-icon',
    },
    {
      route: '/admin/orders',
      label: 'Orders',
      icon: 'orders-icon',
    },
    {
      route: '/admin/stores',
      label: 'Stores',
      icon: 'stores-icon',
    },
  ];
  userEmail: string | null = null;
  logout() {
        // Clear session storage
        sessionStorage.clear();
        // Redirect to home or login page
        this.router.navigate(['/']);
  }

  constructor(private router: Router) { }
  isLoggedIn = false
  ngOnInit() {
    const token = sessionStorage.getItem('token');
    this.isLoggedIn = !!token;

    
    this.userEmail = sessionStorage.getItem('userEmail');
    // Update page title based on current route
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePageTitle();
      });
  }

  updatePageTitle() {
    const currentUrl = this.router.url;
    const routeTitle = this.navItems.find(
      (item) => currentUrl.startsWith(item.route)
    );

    this.pageTitle = routeTitle ? routeTitle.label : 'Admin Dashboard';
  }

  getArtistAvatarPlaceholder() {

    // If the email exists, extract the first two letters from the local part of the email
    if (this.userEmail) {
      const namePart = this.userEmail.split('@')[0]; // Get the part before '@'
      const initials = namePart.slice(0, 2).toUpperCase(); // Take the first two letters and convert to uppercase
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=ffd966&color=fff`;
    }

    // Default placeholder if email is not found
    return `https://ui-avatars.com/api/?name=NA&background=ffd966&color=fff`;
  }
}
