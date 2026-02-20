import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-user-registration-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './user-registration-form.html',
  styleUrl: './user-registration-form.scss',
})
export class UserRegistrationForm {
  private fb = inject(FormBuilder);
  private fetchApiData = inject(FetchApiDataService);
  private dialogRef = inject(MatDialogRef<UserRegistrationForm>);
  private snackBar = inject(MatSnackBar);

  isSubmitting = false;

  // Using uppercase keys expected by myFlix API
  registrationForm = this.fb.group({
    Username: ['', [Validators.required, Validators.minLength(5)]],
    Password: ['', [Validators.required, Validators.minLength(8)]],
    Email: ['', [Validators.required, Validators.email]],
    Birthday: [''],
  });

register(): void {
  if (this.registrationForm.invalid) {
    queueMicrotask(() => {
      this.snackBar.open('Please fix the errors in the form.', 'OK', { duration: 2500 });
    });
    return;
  }

  this.isSubmitting = true;

  this.fetchApiData
    .userRegistration(this.registrationForm.value)
    .pipe(finalize(() => (this.isSubmitting = false)))
    .subscribe({
      next: (response) => {
        queueMicrotask(() => {
          this.snackBar.open('Registration successful! You can now log in.', 'OK', { duration: 3000 });
          this.dialogRef.close(response);
        });
      },
      error: (err) => {
        queueMicrotask(() => {
          this.snackBar.open(err?.message ?? 'Registration failed.', 'OK', { duration: 3000 });
        });
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}