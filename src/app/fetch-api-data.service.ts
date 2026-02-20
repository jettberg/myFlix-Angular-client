import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


/**
 * Base URL for the deployed myFlix API.
 * All endpoints in this service are built from this base URL.
 */
const apiUrl = 'https://movies-my-flix-application-7f3ae970a7e3.herokuapp.com/';


/**
 * Service responsible for communicating with the myFlix backend API.
 *
 * This service wraps all HTTP requests for:
 * - authentication (register/login)
 * - movies (fetch movie data)
 * - users (get/update/delete profile)
 * - favorites (add/remove/list favorite movies)
 *
 * All protected requests include the JWT token stored in `localStorage`.
 */
@Injectable({
  providedIn: 'root',
})
/**
 * FetchApiDataService provides strongly-organized methods for API access.
 * Components call these methods instead of dealing with raw HttpClient logic.
 */
export class FetchApiDataService {
  constructor(private http: HttpClient) { }

  // ---------------- AUTH ----------------
  /**
 * Registers a new user.
 *
 * @param userDetails - Registration payload (Username, Password, Email, Birthday).
 * @returns Observable with the created user object from the API.
 */
  public userRegistration(userDetails: any): Observable<any> {
    return this.http
      .post(`${apiUrl}users`, userDetails)
      .pipe(catchError(this.handleError));
  }
  /**
   * Logs in an existing user and returns a JWT token.
   *
   * @param userDetails - Login payload (Username, Password).
   * @returns Observable containing `{ user, token }` on success.
   */
  public userLogin(userDetails: any): Observable<any> {
    return this.http
      .post(`${apiUrl}login`, userDetails)
      .pipe(catchError(this.handleError));
  }

  // ---------------- MOVIES ----------------
  /**
 * Retrieves all movies from the API.
 *
 * Requires a valid JWT token.
 *
 * @returns Observable containing an array of movie objects.
 */
  public getAllMovies(): Observable<any> {
    return this.http
      .get(`${apiUrl}movies`, this.getAuthOptions())
      .pipe(catchError(this.handleError));
  }

  public getOneMovie(title: string): Observable<any> {
    return this.http
      .get(`${apiUrl}movies/${encodeURIComponent(title)}`, this.getAuthOptions())
      .pipe(catchError(this.handleError));
  }
  /**
   * Retrieves director details by director name.
   *
   * Requires a valid JWT token.
   *
   * @param name - Director name.
   * @returns Observable containing director information.
   */
  public getDirector(name: string): Observable<any> {
    return this.http
      .get(`${apiUrl}directors/${encodeURIComponent(name)}`, this.getAuthOptions())
      .pipe(catchError(this.handleError));
  }
  /**
   * Retrieves genre details by genre name.
   *
   * Requires a valid JWT token.
   *
   * @param name - Genre name.
   * @returns Observable containing genre information.
   */
  public getGenre(name: string): Observable<any> {
    return this.http
      .get(`${apiUrl}genres/${encodeURIComponent(name)}`, this.getAuthOptions())
      .pipe(catchError(this.handleError));
  }

  // ---------------- USERS ----------------
  /**
 * Retrieves a user's profile by username.
 *
 * Requires a valid JWT token.
 *
 * @param username - Username to look up.
 * @returns Observable containing the user's profile data.
 */
  public getUser(username: string): Observable<any> {
    return this.http
      .get(`${apiUrl}users/${encodeURIComponent(username)}`, this.getAuthOptions())
      .pipe(catchError(this.handleError));
  }
  /**
   * Updates a user's profile.
   *
   * Requires a valid JWT token.
   *
   * @param username - Username being updated.
   * @param userDetails - Fields to update (Email, Birthday, optional Password).
   * @returns Observable containing the updated user object.
   */
  public editUser(username: string, userDetails: any): Observable<any> {
    return this.http
      .put(`${apiUrl}users/${encodeURIComponent(username)}`, userDetails, this.getAuthOptions())
      .pipe(catchError(this.handleError));
  }
  /**
   * Deletes a user account by username.
   *
   * Requires a valid JWT token.
   *
   * @param username - Username to delete.
   * @returns Observable with API response.
   */
  public deleteUser(username: string): Observable<any> {
    return this.http
      .delete(`${apiUrl}users/${encodeURIComponent(username)}`, this.getAuthOptions())
      .pipe(catchError(this.handleError));
  }

  // ---------------- FAVORITES ----------------
  /**
 * Retrieves the current user's favorite movies list.
 *
 * Requires a valid JWT token.
 *
 * Note: Depending on backend behavior, FavoriteMovies may contain IDs or full movie objects.
 *
 * @param username - Username to look up.
 * @returns Observable containing an array of favorite movies (or IDs).
 */
  public getFavoriteMovies(username: string): Observable<any> {
    return this.http
      .get(`${apiUrl}users/${encodeURIComponent(username)}`, this.getAuthOptions())
      .pipe(
        map((user: any) => user?.FavoriteMovies ?? []),
        catchError(this.handleError)
      );
  }
  /**
   * Retrieves the current user's favorite movies list.
   *
   * Requires a valid JWT token.
   *
   * Note: Depending on backend behavior, FavoriteMovies may contain IDs or full movie objects.
   *
   * @param username - Username to look up.
   * @returns Observable containing an array of favorite movies (or IDs).
   */
  public addFavoriteMovie(username: string, movieId: string): Observable<any> {
    return this.http
      .post(
        `${apiUrl}users/${encodeURIComponent(username)}/movies/${encodeURIComponent(movieId)}`,
        {},
        this.getAuthOptions()
      )
      .pipe(catchError(this.handleError));
  }
  /**
   * Removes a movie from the user's favorites.
   *
   * Requires a valid JWT token.
   *
   * @param username - Username to modify.
   * @param movieId - MongoDB movie ObjectId.
   * @returns Observable containing the updated user object.
   */
  public deleteFavoriteMovie(username: string, movieId: string): Observable<any> {
    return this.http
      .delete(
        `${apiUrl}users/${encodeURIComponent(username)}/movies/${encodeURIComponent(movieId)}`,
        this.getAuthOptions()
      )
      .pipe(catchError(this.handleError));
  }

  // ---------------- HELPERS ----------------
  /**
 * Builds HTTP options including the Authorization header.
 *
 * @returns Object containing HttpHeaders with a Bearer token (if present).
 */
  private getAuthOptions() {
    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token ?? ''}`,
      }),
    };
  }

  private handleError(error: HttpErrorResponse): any {
    console.error('API error:', error);

    // Try to surface the real backend message
    const serverMessage =
      (typeof error.error === 'string' && error.error) ||
      error.error?.message ||
      error.error?.errors ||
      error.message;

    return throwError(() => new Error(serverMessage || 'Request failed; please try again later.'));
  }
}