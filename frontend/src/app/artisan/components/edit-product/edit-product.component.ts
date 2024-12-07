import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from '../../../products/services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [    
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  productForm: FormGroup;

  constructor(
    private _productService: ProductService,
    private fb: FormBuilder,
    private _snackBar : MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any // Data injected here
  ) {
    // Initialize the form with fields and validators
    this.productForm = this.fb.group({
      nomProduit: ['', [Validators.required, Validators.minLength(3)]],
      descriptionProduit: ['', [Validators.required, Validators.maxLength(500)]],
      prix: [null, [Validators.required, Validators.min(0)]],
      quantiteEnStock: [null, [Validators.required, Validators.min(0)]],
      imageProduit: [''],
      idArtisan: [''],
    });
  }

  product: any;

  ngOnInit(): void {
    console.log("to edit:", this.data);
    // Fetch the product details based on the ID passed via MAT_DIALOG_DATA
    this._productService.findProductById(this.data).subscribe(
      (response) => {
        this.product = response;
        console.log('Fetched product:', this.product);
        this.productForm.patchValue({
          nomProduit: this.product.nomProduit,
          descriptionProduit: this.product.descriptionProduit,
          prix: this.product.prix,
          quantiteEnStock: this.product.quantiteEnStock,
          imageProduit: this.product.imageProduit || '', // Set a default image if none exists
          
        });
        // Populate the form with the fetched product data
        
      },
      (error) => {
        console.error('Error fetching product:', error);
      }
    );
  }

  // Handle the form submission
  onEditProduct(): object | void {
    const productData = this.productForm.value;
    console.log('Updated product data:', productData);
    this._productService.updateProductById(this.data,productData).subscribe(
      
    )
    this._snackBar.open("product edited successfully", "Close", { duration: 2000, verticalPosition: 'top' })

    window.location.reload()
    // You can now send the updated product data to the backend or handle it further
    // For example, call a service method to save the updated product
  }

}
