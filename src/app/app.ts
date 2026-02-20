import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('myFlix');
  protected readonly currentUser = signal<string | null>(localStorage.getItem('user'));
  protected readonly token = signal<string | null>(localStorage.getItem('token'));

  constructor(private router: Router, private snackBar: MatSnackBar) {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      queueMicrotask(() => this.refreshAuthState()); // 👈 key change
    });
  }

  refreshAuthState(): void {
    this.currentUser.set(localStorage.getItem('user'));
    this.token.set(localStorage.getItem('token'));
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    this.refreshAuthState();

    this.snackBar.open('Logged out.', 'OK', { duration: 2000 });
    this.router.navigate(['welcome']);
  }
}