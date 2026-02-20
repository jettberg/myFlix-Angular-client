import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export type GenreDialogData = {
  title?: string;
  genre: string[]; // NOT optional now
};

@Component({
  selector: 'app-genre-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './genre-dialog.html',
})
export class GenreDialog {
  data: GenreDialogData;

  constructor(@Inject(MAT_DIALOG_DATA) incoming: Partial<GenreDialogData>) {
    this.data = {
      title: incoming?.title,
      genre: incoming?.genre ?? [],
    };
  }
}