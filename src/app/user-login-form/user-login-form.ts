import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { FetchApiDataService } from '../fetch-api-data.service';


/**
 * UserLoginForm Component
 *
 * Displays the login dialog and handles user authentication.
 * On successful login, stores the returned token + username
 * in `localStorage` and closes the dialog with `{ user, token }`.
 */
@Component({
  selector: 'app-user-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './user-login-form.html',
  styleUrl: './user-login-form.scss',
})
export class UserLoginForm {
  private fb = inject(FormBuilder);
  private fetchApiData = inject(FetchApiDataService);
  private dialogRef = inject(MatDialogRef<UserLoginForm>);
  private snackBar = inject(MatSnackBar);

  /** Used to disable the login button while the request is in progress */
  isSubmitting = false;

  /**
   * Reactive form for login.
   * Uses uppercase keys because the backend expects `Username` and `Password`.
   */
  loginForm = this.fb.group({
    Username: ['', [Validators.required]],
    Password: ['', [Validators.required]],
  });

  /**
 * Attempts to log the user in with the form values.
 * Saves token + username to localStorage on success.
 */
  login(): void {
    if (this.loginForm.invalid) {
      this.snackBar.open('Please enter a username and password.', 'OK', { duration: 2500 });
      return;
    }

    this.isSubmitting = true;

    this.fetchApiData.userLogin(this.loginForm.value).subscribe({
      next: (result) => {
        this.isSubmitting = false;

        // Most CF/myFlix APIs return: { user: {...}, token: "..." }
        const token = result?.token ?? result?.Token;
        const username =
          result?.user?.Username ?? result?.user?.username ?? this.loginForm.value.Username ?? null;

        if (!token || !username) {
          this.snackBar.open('Login response missing token/user.', 'OK', { duration: 3000 });
          return;
        }

        localStorage.setItem('token', token);
        localStorage.setItem('user', username);

        this.dialogRef.close({ user: username, token });
      },
      error: (err) => {
        this.isSubmitting = false;
        this.snackBar.open(err?.message ?? 'Login failed.', 'OK', { duration: 3000 });
      },
    });
  }

  /**
 * Closes the login dialog without logging in.
 */
  close(): void {
    this.dialogRef.close();
  }
}