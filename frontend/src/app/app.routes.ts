import { Routes } from '@angular/router';


export const routes: Routes = [
  { path: '', redirectTo: '/registration', pathMatch: 'full' },
  { path: 'registration',
    loadComponent() {
      return import('./component/registration/registration')
      .then(mod => mod.Registration);
    },
  },
  { path: 'login', 
    loadComponent() {
      return import('./component/login/login')
      .then(mod => mod.Login);
    }
  },
];
