import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

/**
 * Data structure passed into the Genre dialog.
 */
export type GenreDialogData = {
  title?: string;
  genre: string[];
};

/**
 * GenreDialog Component
 *
 * Displays the genre information for a selected movie.
 * Receives movie title and genre array via Angular Material dialog data injection.
 */
@Component({
  selector: 'app-genre-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './genre-dialog.html',
})
export class GenreDialog {
  /** Normalized dialog data used by the template */
  data: GenreDialogData;

  /**
   * Creates a Genre dialog instance.
   * Ensures genre always defaults to an empty array if undefined.
   */
  constructor(@Inject(MAT_DIALOG_DATA) incoming: Partial<GenreDialogData>) {
    this.data = {
      title: incoming?.title,
      genre: incoming?.genre ?? [],
    };
  }
}