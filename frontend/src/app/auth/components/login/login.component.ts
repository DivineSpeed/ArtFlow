import { Component } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  matcher = new ErrorStateMatcher();
  PasswordFormControl = new FormControl('', [Validators.required]);
  matcher2 = new ErrorStateMatcher();

  //user: User = new User();

  form!: FormGroup
  constructor(private loginUserService: AuthService, private fb: FormBuilder, private route: Router, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.form = new FormGroup({});
  }
  userLogin() {
    const data = {
      email: this.emailFormControl.value,
      password: this.PasswordFormControl.value
    };
    if (data.email == "" || data.password == "") {
      this._snackBar.open("Les champs sont obligatoire", "Close", { duration: 3000, verticalPosition: 'top' });

    } else {
      this.loginUserService.login(data).subscribe(
        (response: any) => {
          console.log("Response:", response);
          if (response) {
            console.log("Login successful");
            this._snackBar.open("Login réussi", "Close", { duration: 3000, verticalPosition: 'top' });
            if(response.role=="ARTISAN"){
              this.route.navigate(["/artisan/myspace"]);
            }
            else{
              this.route.navigate(["/admin/dashboard"]);
            }
            sessionStorage.setItem('token', response.token);
            sessionStorage.setItem('role', response.role);
            sessionStorage.setItem('userId', response.userId);
          } else {
            this._snackBar.open("Login failed", "Close", { duration: 3000, verticalPosition: 'top' });
          }
        },
        (error) => {
          console.log("");
          this._snackBar.open("Login failed : email or password invalid", "Close", { duration: 3000, verticalPosition: 'top' });
          console.error("Error:", error);

        }
      );
    }

  }
}
