import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { ArtisanRoutingModule } from './artisan-routing.module';
import { HeaderComponent } from '../layout/components/header/header.component';

@NgModule({
  declarations: [],
  imports: [
    HeaderComponent,
    CommonModule,
    ArtisanRoutingModule,
    
  ]
})
export class ArtisanModule { }
