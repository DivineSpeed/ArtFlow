import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { HeaderComponent } from "../../../layout/components/header/header.component";

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit {

  totalStores!: number;
  totalRevenue!: number;
  totalProducts!: number;
  totalCountriesRepresented!: number;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getTotalStores().subscribe(count => {
      this.totalStores = count;
    });

    this.dataService.getTotalRevenue().subscribe(revenue => {
      this.totalRevenue = revenue;
    });

    this.dataService.getTotalProducts().subscribe(count => {
      this.totalProducts = count;
    });

    this.dataService.getTotalCountriesRepresented().subscribe(total => {
      this.totalCountriesRepresented = total;
    });
  
  }



}
