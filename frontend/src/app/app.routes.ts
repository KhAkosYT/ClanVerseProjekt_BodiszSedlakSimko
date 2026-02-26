import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';


export const routes: Routes = [
  { path: '', redirectTo: '/fooldal', pathMatch: 'full' },
  { path: 'fooldal',
    loadComponent() {
      return import('./component/fooldal/fooldal')
      .then(mod => mod.Fooldal);
    }
  },

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

  { path: 'clans',
    loadComponent() {
      return import('./component/clans/clans')
      .then(mod => mod.Clans);
    }
  },

   { path: 'createclan',
    canActivate: [authGuard],
    loadComponent() {
      return import('./component/createclan/createclan')
      .then(mod => mod.Createclan);
    }
   },

   { path: 'message/:clanId',
    canActivate: [authGuard],
    loadComponent() {
      return import('./component/message/message')
      .then(mod => mod.Messages);
    }
   },

   { path: 'profile',
    canActivate: [authGuard],
    loadComponent() {
      return import('./component/profile/profile')
      .then(mod => mod.Profile);
    }
   },

   { path: 'admin',
    canActivate: [authGuard],
    loadComponent() {
      return import('./component/admin/admin')
      .then(mod => mod.Admin);
    }
   },

   { path: 'aszf',
    loadComponent() {
      return import('./component/aszf/aszf')
      .then(mod => mod.Aszf);
    }
   },

];
