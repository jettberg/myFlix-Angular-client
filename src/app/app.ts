import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { UserRegistrationForm } from './user-registration-form/user-registration-form';
import { UserLoginForm } from './user-login-form/user-login-form';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatDialogModule,
    MatToolbarModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('myFlix-Angular-client');

  protected readonly currentUser = signal<string | null>(localStorage.getItem('user'));
  protected readonly token = signal<string | null>(localStorage.getItem('token'));

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {}

  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationForm, {
      width: '400px',
    });
  }

  openUserLoginDialog(): void {
    const dialogRef = this.dialog.open(UserLoginForm, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      // result will be { user: string, token: string } on success, or undefined if cancelled
      if (!result) return;

      this.currentUser.set(result.user);
      this.token.set(result.token);

      this.snackBar.open(`Welcome, ${result.user}!`, 'OK', { duration: 2500 });
    });
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    this.currentUser.set(null);
    this.token.set(null);

    this.snackBar.open('Logged out.', 'OK', { duration: 2000 });
  }
}