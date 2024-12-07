import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../products/services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  productForm: FormGroup;

  constructor(private fb: FormBuilder,private _productService : ProductService,private _snacBar : MatSnackBar) {
    this.productForm = this.fb.group({
      nomProduit: ['', [Validators.required, Validators.minLength(3)]],
      descriptionProduit: ['', [Validators.required, Validators.maxLength(500)]],
      prix: [null, [Validators.required, Validators.min(0)]],
      quantiteEnStock: [null, [Validators.required, Validators.min(0)]],
      imageProduit: [''],
      
    });
  }
  // Handle the form submission
  onAddProduct(): object | void {
      const productData = {
        "userId" : sessionStorage.getItem("userId"),
        "produit" :  {
          "nomProduit": this.productForm.value.nomProduit,
          "descriptionProduit": this.productForm.value.descriptionProduit,
          "prix":this.productForm.value.prix,
          "quantiteEnStock": this.productForm.value.quantiteEnStock,
          "imageProduit": this.productForm.value.imageProduit,
      }
      }
      
  
  
    this._productService.addProduct(productData).subscribe(
      (r)=>{
        this._snacBar.open("product added successfully", "Close", { duration: 2000, verticalPosition: 'top' })
        window.location.reload()
      }
    )


      

  }

}
