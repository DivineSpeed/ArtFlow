import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { ProductService } from '../../../products/services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  firstFormGroup: FormGroup;
  store: any; // Store object to hold the fetched store data

  constructor(
    private formBuilder: FormBuilder,
    private _prodService: ProductService,
    private _snackBar : MatSnackBar
  ) {
    // Initialize the form group using FormBuilder
    this.firstFormGroup = this.formBuilder.group({
      instagramLink: ['', Validators.required],
      facebookLink: ['', Validators.required],
      firstName: ['', Validators.required], // First Name
      lastName: ['', Validators.required],  // Last Name
      phoneNumber: ['', Validators.required], // Phone Number
      storeName: ['', Validators.required], // Store Name
      storeAddress: ['', Validators.required], // Store Address
      storeDescription: ['', Validators.required] // Store Description
    });
  }

  ngOnInit(): void {
    // Fetch the store data from the service
    this._prodService.getStoreById().subscribe(
      (data) => {
        this.store = data;
        console.log('Fetched store:', this.store);

        // Populate the form after the data is fetched
        this.firstFormGroup.patchValue({
          firstName: this.store.artisan.nomArtisan,
          lastName: this.store.artisan.prenomArtisan,
          phoneNumber: this.store.artisan.numTelephone,
          storeName: this.store.nomBoutique,
          storeAddress: this.store.adresseBoutique,
          storeDescription: this.store.description,
          facebookLink: this.store.facebookLink,
          instagramLink: this.store.instagramLink,
        });
      },
      (error) => {
        console.error('Error fetching store data:', error);
      }
    );
  }

  // Method to handle form submission
  createStore() {
    console.log('Form data before submission:', this.firstFormGroup.value);

    const data = {
      userId: sessionStorage.getItem("userId"),
      nomArtisan: this.firstFormGroup.value.firstName,
      prenomArtisan: this.firstFormGroup.value.lastName,
      numTelephone: this.firstFormGroup.value.phoneNumber,
      nomBoutique: this.firstFormGroup.value.storeName,
      description: this.firstFormGroup.value.storeDescription,
      adresseBoutique: this.firstFormGroup.value.storeAddress,
      facebookLink: this.firstFormGroup.value.facebookLink,
      instagramLink: this.firstFormGroup.value.instagramLink,
    };

    this._prodService.updateProfile(data).subscribe(
      (r)=>{
        
        console.log(r)}
    )
    this._snackBar.open("product edited successfully", "Close", { duration: 2000, verticalPosition: 'top' })
    window.location.reload()
  }
}
