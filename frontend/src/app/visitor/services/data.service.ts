import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  getCategories() {
    return [
      { name: 'Sculptures', imageUrl: 'assets/categories/sculptures.png' },
      { name: 'Paintings', imageUrl: 'assets/categories/paintings.png' },
      { name: 'Photography', imageUrl: 'assets/categories/photography.png' },
      { name: 'Digital Art', imageUrl: 'assets/categories/digital-drawing.png' },
    ];
  }

  // Testimonials data
  getTestimonials() {
    return [
      { message: 'Amazing artworks! Highly recommended.', name: 'John Doe' },
      { message: 'The quality is outstanding, and the process was smooth.', name: 'Jane Smith' },
      { message: 'Unique pieces that I couldn’t find elsewhere!', name: 'Emily Johnson' },
    ];
  }
}
