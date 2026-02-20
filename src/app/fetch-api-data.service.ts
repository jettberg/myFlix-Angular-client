import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const apiUrl = 'https://movies-my-flix-application-7f3ae970a7e3.herokuapp.com/';

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  // ---------------- AUTH ----------------
  public userRegistration(userDetails: any): Observable<any> {
    return this.http
      .post(`${apiUrl}users`, userDetails)
      .pipe(catchError(this.handleError));
  }

  public userLogin(userDetails: any): Observable<any> {
    return this.http
      .post(`${apiUrl}login`, userDetails)
      .pipe(catchError(this.handleError));
  }

  // ---------------- MOVIES ----------------
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

  public getDirector(name: string): Observable<any> {
    return this.http
      .get(`${apiUrl}directors/${encodeURIComponent(name)}`, this.getAuthOptions())
      .pipe(catchError(this.handleError));
  }

  public getGenre(name: string): Observable<any> {
    return this.http
      .get(`${apiUrl}genres/${encodeURIComponent(name)}`, this.getAuthOptions())
      .pipe(catchError(this.handleError));
  }

  // ---------------- USERS ----------------
  public getUser(username: string): Observable<any> {
    return this.http
      .get(`${apiUrl}users/${encodeURIComponent(username)}`, this.getAuthOptions())
      .pipe(catchError(this.handleError));
  }

  public editUser(username: string, userDetails: any): Observable<any> {
    return this.http
      .put(`${apiUrl}users/${encodeURIComponent(username)}`, userDetails, this.getAuthOptions())
      .pipe(catchError(this.handleError));
  }

  public deleteUser(username: string): Observable<any> {
    return this.http
      .delete(`${apiUrl}users/${encodeURIComponent(username)}`, this.getAuthOptions())
      .pipe(catchError(this.handleError));
  }

  // ---------------- FAVORITES ----------------
  public getFavoriteMovies(username: string): Observable<any> {
    return this.http
      .get(`${apiUrl}users/${encodeURIComponent(username)}`, this.getAuthOptions())
      .pipe(
        map((user: any) => user?.FavoriteMovies ?? []),
        catchError(this.handleError)
      );
  }

  public addFavoriteMovie(username: string, movieId: string): Observable<any> {
    return this.http
      .post(
        `${apiUrl}users/${encodeURIComponent(username)}/movies/${encodeURIComponent(movieId)}`,
        {},
        this.getAuthOptions()
      )
      .pipe(catchError(this.handleError));
  }

  public deleteFavoriteMovie(username: string, movieId: string): Observable<any> {
    return this.http
      .delete(
        `${apiUrl}users/${encodeURIComponent(username)}/movies/${encodeURIComponent(movieId)}`,
        this.getAuthOptions()
      )
      .pipe(catchError(this.handleError));
  }

  // ---------------- HELPERS ----------------
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
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}