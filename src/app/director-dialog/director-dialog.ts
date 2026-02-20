import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

/**
 * DirectorDialog Component
 *
 * Displays director information for a selected movie.
 * Receives dialog data through Angular Material's MAT_DIALOG_DATA injection token.
 */
@Component({
  selector: 'app-director-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './director-dialog.html',
})
export class DirectorDialog {
  /**
   * Creates a Director dialog instance.
   *
   * @param data Contains movie title and director name.
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { title?: string; director?: string }
  ) {}
}