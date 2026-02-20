import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-director-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './director-dialog.html',
})
export class DirectorDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title?: string; director?: string }) {}
}