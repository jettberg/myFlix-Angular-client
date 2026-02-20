import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-movie-details-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './movie-details-dialog.html',
})
export class MovieDetailsDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public movie: any) {}
}