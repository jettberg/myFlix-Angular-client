import { Routes } from '@angular/router';
import { WelcomePage } from './welcome-page/welcome-page';
import { MovieCard } from './movie-card/movie-card';
import { UserProfile } from './user-profile/user-profile';

/**
 * Application Routes
 *
 * Defines the main client-side routes for the myFlix Angular app.
 *
 * Routes:
 * - `/welcome`: Landing page with login/register dialogs
 * - `/movies`: Movie browsing page (movie cards + dialogs + favorites)
 * - `/profile`: User profile page (edit profile + manage favorites)
 *
 * Fallback behavior:
 * - Empty path redirects to `/welcome`
 * - Unknown paths (`**`) redirect to `/welcome`
 */

export const routes: Routes = [
    { path: 'welcome', component: WelcomePage },
    { path: 'movies', component: MovieCard },
    { path: 'profile', component: UserProfile },

    { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    { path: '**', redirectTo: 'welcome' },
];