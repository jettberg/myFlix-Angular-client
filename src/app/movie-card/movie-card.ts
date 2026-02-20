import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

import { FetchApiDataService } from '../fetch-api-data.service';
import { GenreDialog } from '../genre-dialog/genre-dialog';
import { DirectorDialog } from '../director-dialog/director-dialog';
import { MovieDetailsDialog } from '../movie-details-dialog/movie-details-dialog';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.scss',
})
export class MovieCard implements OnInit, OnDestroy {
  private api = inject(FetchApiDataService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  private routerSub?: Subscription;

  movies: any[] = [];
  isLoading = true;

  // --- Favorites state ---
  favoriteIds = new Set<string>(); // movie _id strings
  private favoriteBusyIds = new Set<string>(); // prevents double-click spam

  ngOnInit(): void {
    this.getMovies();
    this.loadFavorites();

    // Re-sync favorites whenever navigation ends on /movies
    this.routerSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        // supports /movies and /movies?something
        if (e.urlAfterRedirects.startsWith('/movies')) {
          this.loadFavorites();
        }
      });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
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

  loadFavorites(): void {
    const user = this.getUsername();
    if (!user) {
      this.favoriteIds = new Set();
      return;
    }

    this.api.getFavoriteMovies(user).subscribe({
      next: (fav: any) => {
        const ids: string[] = Array.isArray(fav)
          ? fav
              .map((x: any) => this.normalizeId(x))
              .filter((x: any) => typeof x === 'string')
          : [];

        this.favoriteIds = new Set(ids);
      },
      error: () => {
        // If favorites fail to load, still show movies; just leave hearts empty
        this.favoriteIds = new Set();
      },
    });
  }

  getMovies(): void {
    this.isLoading = true;

    this.api
      .getAllMovies()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (resp: any) => {
          this.movies = Array.isArray(resp) ? resp : [];
        },
        error: (err) => {
          queueMicrotask(() => {
            this.snackBar.open(
              `Failed to load movies. ${err?.message ? String(err.message) : ''}`,
              'OK',
              { duration: 4000 }
            );
          });
          this.movies = [];
        },
      });
  }

  openGenreDialog(movie: any): void {
    this.dialog.open(GenreDialog, {
      width: '420px',
      data: { title: movie?.title, genre: movie?.genre },
    });
  }

  openDirectorDialog(movie: any): void {
    this.dialog.open(DirectorDialog, {
      width: '420px',
      data: { title: movie?.title, director: movie?.director },
    });
  }

  openMovieDetailsDialog(movie: any): void {
    this.dialog.open(MovieDetailsDialog, {
      width: '520px',
      data: movie,
    });
  }

  // --- Favorites toggle ---
  isFavorited(movie: any): boolean {
    const id = this.normalizeId(movie?._id);
    return !!id && this.favoriteIds.has(id);
  }

  isFavoriteBusy(movie: any): boolean {
    const id = this.normalizeId(movie?._id);
    return !!id && this.favoriteBusyIds.has(id);
  }

  toggleFavorite(movie: any): void {
    const user = this.getUsername();
    const movieId = this.normalizeId(movie?._id);

    if (!user || !movieId) {
      this.snackBar.open('Missing user or movie id.', 'OK', { duration: 2500 });
      return;
    }

    if (this.favoriteBusyIds.has(movieId)) return;
    this.favoriteBusyIds.add(movieId);

    const isFav = this.favoriteIds.has(movieId);

    const request$ = isFav
      ? this.api.deleteFavoriteMovie(user, movieId)
      : this.api.addFavoriteMovie(user, movieId);

    request$.pipe(finalize(() => this.favoriteBusyIds.delete(movieId))).subscribe({
      next: () => {
        if (isFav) {
          this.favoriteIds.delete(movieId);
          this.snackBar.open('Removed from favorites.', 'OK', { duration: 2000 });
        } else {
          this.favoriteIds.add(movieId);
          this.snackBar.open('Added to favorites!', 'OK', { duration: 2000 });
        }
      },
      error: () => {
        this.snackBar.open('Could not update favorites.', 'OK', { duration: 3000 });
      },
    });
  }
}