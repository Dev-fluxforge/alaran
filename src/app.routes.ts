
import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home.component').then(c => c.HomeComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./about.component').then(c => c.AboutComponent)
  },
  {
    path: 'services',
    loadComponent: () => import('./services.component').then(c => c.ServicesComponent)
  },
  {
    path: 'projects',
    loadComponent: () => import('./projects.component').then(c => c.ProjectsComponent)
  },
  {
    path: 'project/:slug',
    loadComponent: () => import('./project-detail.component').then(c => c.ProjectDetailComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./contact.component').then(c => c.ContactComponent)
  },
  {
    path: 'careers',
    loadComponent: () => import('./careers.component').then(c => c.CareersComponent)
  },
  {
    path: 'news',
    loadComponent: () => import('./news.component').then(c => c.NewsComponent)
  },
  {
    path: 'chat',
    loadComponent: () => import('./chat.component').then(c => c.ChatComponent)
  },
  {
    path: 'privacy',
    loadComponent: () => import('./privacy.component').then(c => c.PrivacyPolicyComponent)
  },
  {
    path: 'terms',
    loadComponent: () => import('./terms.component').then(c => c.TermsComponent)
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
