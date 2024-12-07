import { Component } from '@angular/core';
import { HeaderComponent } from '../layout/components/header/header.component';
import { ProductCardComponent } from '../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [
    ProductCardComponent,
    HeaderComponent
  ],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent {

}
