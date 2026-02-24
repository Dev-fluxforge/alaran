
import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: 'home',
    title: 'Home | Alaran Geo-Service',
    loadComponent: () => import('./home.component').then(c => c.HomeComponent)
  },
  {
    path: 'about',
    title: 'About Us | Alaran Geo-Service',
    loadComponent: () => import('./about.component').then(c => c.AboutComponent)
  },
  {
    path: 'services',
    title: 'Our Services | Alaran Geo-Service',
    loadComponent: () => import('./services.component').then(c => c.ServicesComponent)
  },
  {
    path: 'projects',
    title: 'Projects | Alaran Geo-Service',
    loadComponent: () => import('./projects.component').then(c => c.ProjectsComponent)
  },
  {
    path: 'project/:slug',
    title: 'Project Details | Alaran Geo-Service',
    loadComponent: () => import('./project-detail.component').then(c => c.ProjectDetailComponent)
  },
  {
    path: 'contact',
    title: 'Contact Us | Alaran Geo-Service',
    loadComponent: () => import('./contact.component').then(c => c.ContactComponent)
  },
  {
    path: 'careers',
    title: 'Careers | Alaran Geo-Service',
    loadComponent: () => import('./careers.component').then(c => c.CareersComponent)
  },
  {
    path: 'news',
    title: 'News & Updates | Alaran Geo-Service',
    loadComponent: () => import('./news.component').then(c => c.NewsComponent)
  },
  {
    path: 'chat',
    title: 'AI Assistant | Alaran Geo-Service',
    loadComponent: () => import('./chat.component').then(c => c.ChatComponent)
  },
  {
    path: 'privacy',
    title: 'Privacy Policy | Alaran Geo-Service',
    loadComponent: () => import('./privacy.component').then(c => c.PrivacyPolicyComponent)
  },
  {
    path: 'terms',
    title: 'Terms of Service | Alaran Geo-Service',
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
