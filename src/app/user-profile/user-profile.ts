import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile implements OnInit {
  private api = inject(FetchApiDataService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  isLoading = true;

  // Favorites list (can be populated objects OR ids depending on backend)
  favoriteMovies: any[] = [];
  removingIds = new Set<string>();

  profileForm = this.fb.group({
    Username: [{ value: '', disabled: true }],
    Password: [''], // optional update
    Email: ['', [Validators.required, Validators.email]],
    Birthday: [''],
  });

  ngOnInit(): void {
    this.loadUser();
  }

  private getUsername(): string | null {
    return localStorage.getItem('user');
  }

  private normalizeId(v: any): string | null {
    if (!v) return null;
    if (typeof v === 'string') return v;
    if (typeof v === 'object' && v._id) return String(v._id);
    return null;
  }

  loadUser(): void {
    const username = this.getUsername();
    if (!username) {
      this.isLoading = false;
      this.snackBar.open('Not logged in.', 'OK', { duration: 2500 });
      return;
    }

    this.api.getUser(username).subscribe({
      next: (user) => {
        this.isLoading = false;

        const uName = user?.Username ?? user?.username ?? user?.name ?? '';
        const email = user?.Email ?? user?.email ?? '';
        const birthdayRaw = user?.Birthday ?? user?.birthday ?? null;

        this.profileForm.patchValue({
          Username: uName,
          Email: email,
          Birthday: birthdayRaw ? String(birthdayRaw).slice(0, 10) : '',
        });

        // Favorites can be either:
        // - array of movie objects (populated)
        // - array of ids
        this.favoriteMovies = Array.isArray(user?.FavoriteMovies)
          ? user.FavoriteMovies
          : Array.isArray(user?.favoriteMovies)
            ? user.favoriteMovies
            : [];
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to load profile.', 'OK', { duration: 3000 });
      },
    });
  }

  save(): void {
    const username = this.getUsername();
    if (!username) return;

    if (this.profileForm.invalid) {
      this.snackBar.open('Please fix the form errors.', 'OK', { duration: 2500 });
      return;
    }

    const raw = this.profileForm.getRawValue();
    const update: any = {
      Email: raw.Email,
      Birthday: raw.Birthday || null,
    };

    if (raw.Password && raw.Password.trim().length > 0) {
      update.Password = raw.Password;
    }

    this.api.editUser(username, update).subscribe({
      next: () => {
        this.snackBar.open('Profile updated!', 'OK', { duration: 2500 });
        this.profileForm.patchValue({ Password: '' });
      },
      error: () => this.snackBar.open('Failed to update profile.', 'OK', { duration: 3000 }),
    });
  }

  isRemoving(movie: any): boolean {
    const id = this.normalizeId(movie?._id ?? movie);
    return !!id && this.removingIds.has(id);
  }

  removeFromFavorites(movie: any): void {
    const username = this.getUsername();
    const movieId = this.normalizeId(movie?._id ?? movie);

    if (!username || !movieId) {
      this.snackBar.open('Missing user or movie id.', 'OK', { duration: 2500 });
      return;
    }

    if (this.removingIds.has(movieId)) return;
    this.removingIds.add(movieId);

    this.api.deleteFavoriteMovie(username, movieId).subscribe({
      next: () => {
        this.removingIds.delete(movieId);

        // Remove locally:
        this.favoriteMovies = (this.favoriteMovies ?? []).filter((m) => {
          const id = this.normalizeId(m?._id ?? m);
          return id !== movieId;
        });

        this.snackBar.open('Removed from favorites.', 'OK', { duration: 2000 });
      },
      error: () => {
        this.removingIds.delete(movieId);
        this.snackBar.open('Could not remove favorite.', 'OK', { duration: 3000 });
      },
    });
  }
}