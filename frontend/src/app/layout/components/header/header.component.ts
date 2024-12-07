import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
  CommonModule,
  RouterModule
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  constructor(private auth : AuthService, private router:Router) {}; 
  User = {
    token: "",
    role: "",
    userId: ""
  };
  
  isLoggedIn = false;
  
  ngOnInit(): void {
    // Check if the user is initially logged in based on the presence of the token
    const token = sessionStorage.getItem('token');
    this.isLoggedIn = !!token;
  
    if (this.isLoggedIn) {
      this.User.token = token || ""; // Assign the token if it exists
      this.User.role = sessionStorage.getItem('role') || ""; // Safely assign the role
      this.User.userId = sessionStorage.getItem('userId') || ""; // Safely assign the userId
    }
  }
  isFixedNavbar = false;
  
  logout() {
    this.auth.logout().subscribe(
      (r)=>{
        console.log(r)
      }
    )

    ;
    window.location.reload();

  
  }


}
