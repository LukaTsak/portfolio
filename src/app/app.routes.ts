import { Routes } from '@angular/router';
import { Desktop } from './desktop/desktop';

export const routes: Routes = [
    {path: '', redirectTo : 'desktop', pathMatch: 'full' },
    {path: 'desktop', component: Desktop, pathMatch: 'full' },
];
