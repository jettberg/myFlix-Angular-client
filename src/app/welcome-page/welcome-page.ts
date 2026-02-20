import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { UserRegistrationForm } from '../user-registration-form/user-registration-form';
import { UserLoginForm } from '../user-login-form/user-login-form';

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './welcome-page.html',
  styleUrl: './welcome-page.scss',
})
export class WelcomePage {
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationForm, { width: '400px' });
  }

  openUserLoginDialog(): void {
    const ref = this.dialog.open(UserLoginForm, { width: '400px' });

    ref.afterClosed().subscribe((result) => {
      // result is { user, token } if login succeeded
      if (!result) return;

      this.snackBar.open(`Welcome, ${result.user}!`, 'OK', { duration: 2500 });
      this.router.navigate(['movies']);
    });
  }
}