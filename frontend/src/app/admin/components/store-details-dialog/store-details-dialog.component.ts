import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-store-details-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatDialogModule],
  templateUrl: './store-details-dialog.component.html',
  styleUrl: './store-details-dialog.component.css',
  encapsulation: ViewEncapsulation.None
})
export class StoreDetailsDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<StoreDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {


  }
  ngOnInit(): void {
    this.dialogRef.updateSize('650px');
    this.dialogRef.addPanelClass('custom-dialog-panel');
  }

  getArtistAvatarPlaceholder() {
    const baseColors = [
      '667EEA', // rgba(102, 126, 234, 0.7)
      '4ADE80', // rgba(74, 222, 128, 0.7)
      'FCA5A5', // rgba(252, 165, 165, 0.7)
      'F9A8D4', // rgba(249, 168, 212, 0.7)
      '86EFAC', // rgba(134, 239, 172, 0.7)
      '93C5FD', // rgba(147, 197, 253, 0.7)
      'D8B4FE', // rgba(216, 180, 254, 0.7)
      'FDBA74', // rgba(253, 186, 116, 0.7)
      '818CF8', // rgba(129, 140, 248, 0.7)
      '60A5FA', // rgba(96, 165, 250, 0.7)
    ];

    // Select a random color from the array
    const randomColor = baseColors[Math.floor(Math.random() * baseColors.length)];

    // Construct the URL with the random background color
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(`${this.data.artisan.prenomArtisan} ${this.data.artisan.nomArtisan}`)}&background=${randomColor}&color=fff`;
  }


}
