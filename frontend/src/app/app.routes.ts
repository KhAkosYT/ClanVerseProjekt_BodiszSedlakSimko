import { Routes } from '@angular/router';


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

  { path: 'dashboard',
    loadComponent() {
      return import('./component/dashboard/dashboard')
      .then(mod => mod.Dashboard);
    }
  },

  { path: 'clans',
    loadComponent() {
      return import('./component/clans/clans')
      .then(mod => mod.Clans);
    }
  },

   { path: 'createclan',
    loadComponent() {
      return import('./component/createclan/createclan')
      .then(mod => mod.Createclan);
    }
   },
];
