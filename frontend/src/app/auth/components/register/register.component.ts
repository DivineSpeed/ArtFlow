import { Component, inject, OnInit , NgModule} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatStepperModule,
    CommonModule,            // Import CommonModule
    ReactiveFormsModule,     // Import ReactiveFormsModule for forms
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,  // Add MatFormFieldModule here
    MatInputModule   ,
    MatButtonModule ,
            // Import the standalone LoginComponent here
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent implements OnInit {

  constructor(private snackBar: MatSnackBar,private authService:AuthService,private route:Router) {}
  
  ngOnInit(): void {}

  private _formBuilder = inject(FormBuilder);

  // Form Groups
  firstFormGroup = this._formBuilder.group({
    
    firstName: ['', Validators.required],                   // First Name
    lastName: ['', Validators.required],  
    phoneNumber: ['', Validators.required],   
  });
  secondFormGroup = this._formBuilder.group({
    storeName: ['', Validators.required],                   // Store Name
    storeAddress: ['', Validators.required],                
    storeDescription: ['', Validators.required],            
  });
  thirdFormGroup = this._formBuilder.group(
    {
      email: ['', [Validators.required, Validators.email]], // Email
      password: ['', Validators.required], // Password
      rePassword: ['', Validators.required], // Confirm Password
    },
  );


  isLinear = false;
  passwordVerif=""  
  passwordMatch=""
  // Method to handle Create Store button click
  createStore() {
    const artisan = {
      nomArtisan: this.firstFormGroup.value.firstName,
      prenomArtisan: this.firstFormGroup.value.lastName,
      numTelephone: this.firstFormGroup.value.phoneNumber,
      email: this.thirdFormGroup.value.email,
      password: this.thirdFormGroup.value.password,   
      nomBoutique: this.secondFormGroup.value.storeName,
      instagramLink: this.secondFormGroup.value.storeAddress,
      description: this.secondFormGroup.value.storeDescription,
      role:"ARTISAN",
      adresseBoutique:this.secondFormGroup.value.storeAddress,
      facebookLink:""
    };
    // Regular expression for password strength
    const passwordStrengthRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    // Ensure the password is not null or undefined
    const password = this.thirdFormGroup.value.password ?? '';
    const rePassword = this.thirdFormGroup.value.rePassword ?? '';

    if (!passwordStrengthRegex.test(password)) {
      this.passwordVerif="Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.', 'Close'"
      this.snackBar.open("Password must be at least 8 characters long, at least one uppercase, one lowercase, one number, and one special character.", "Close", { duration: 3000 });
      return;

    }

    if (password !== rePassword) {
      this.passwordMatch='Please make sure the passwords are matching.', 'Close'
      this.snackBar.open("Please make sure the passwords are matching.", "Close", { duration: 3000 });

      return;
    }

    else{
      this.authService.signIn(artisan).subscribe(
        (r:any)=>{
          console.log("response",r)
          if (r) {
            this.snackBar.open("Account created", "Close", { duration: 3000 ,verticalPosition: 'top' });
            this.route.navigate(["/login"]);
          } else {
            
          }
        },
        (error) => {
          console.log(""); // Assuming server sends an error message
            this.snackBar.open("Create Store failed : email already exists", "Close", { duration: 3000  ,verticalPosition: 'top' });
          console.error("Error:", error);
          
        }
      );
  }

}
}

