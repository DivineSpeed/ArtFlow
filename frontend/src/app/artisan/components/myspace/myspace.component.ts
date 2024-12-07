import { Component, NgModule, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddProductComponent } from '../add-product/add-product.component';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { HeaderComponent } from "../../../layout/components/header/header.component";
import { FooterComponent } from '../../../layout/components/footer/footer.component';
import { ProductService } from '../../../products/services/product.service';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-myspace',
    standalone: true,
    templateUrl: './myspace.component.html',
    styleUrl: './myspace.component.css',
    imports: [HeaderComponent,CommonModule,
    FooterComponent]
})
export class MyspaceComponent  implements OnInit {
  products : any 
  store : any 
  ngOnInit(): void {
    this._prodService.getProductByUSer().subscribe(
      (data) => {
        this.products = data
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );

    this._prodService.getStoreById().subscribe(
      (data) => {
        this.store = data
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    )
   
  }
  constructor(public dialog: MatDialog,private _prodService : ProductService,private _snackBar : MatSnackBar) {}

  openDialog(): void {
    this.dialog.open(AddProductComponent, {
      width: '550px', // Adjust width as needed
      // You can add other configuration options here
    });
  }
  openDialogEdit(id:any): void {
    this.dialog.open(EditProductComponent, {
      width: '550px', 
      data: id// Adjust width as needed
      // You can add other configuration options here
    });
  }

  open_Dialog_Edit_Profile(): void {
    this.dialog.open(EditProfileComponent, {
      width: '600px',
       // Adjust width as needed
      // You can add other configuration options here
    });
  }
  deleteProduct(id: any) {
    const isConfirmed = window.confirm("Are you sure you want to delete this product?");
    
    if (isConfirmed) {
      this._prodService.deleteProductById(id).subscribe(
      )
     
        this._snackBar.open("product added successfully", "Close", { duration: 2000, verticalPosition: 'top' })
        
      window.location.reload()
      }
  }
  
  
}
