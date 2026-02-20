import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

/**
 * MovieDetailsDialog Component
 *
 * A simple Angular Material dialog that displays the full details
 * of a selected movie (title, year, director, genres, cast, etc.).
 *
 * Data is provided by the component that opens the dialog
 * (MovieCard) using Angular Material's `MAT_DIALOG_DATA`.
 */
@Component({
  selector: 'app-movie-details-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './movie-details-dialog.html',
})
export class MovieDetailsDialog {
  /**
   * Creates the dialog instance.
   *
   * @param movie The movie object passed in from the MovieCard component.
   */
  constructor(@Inject(MAT_DIALOG_DATA) public movie: any) {}
}