import { Routes } from '@angular/router';
import { WelcomePage } from './welcome-page/welcome-page';
import { MovieCard } from './movie-card/movie-card';
import { UserProfile } from './user-profile/user-profile';

export const routes: Routes = [
  { path: 'welcome', component: WelcomePage },
  { path: 'movies', component: MovieCard },
  { path: 'profile', component: UserProfile },

  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: '**', redirectTo: 'welcome' },
];