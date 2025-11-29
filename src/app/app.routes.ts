import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Verify } from './pages/verify/verify';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },  
  {
    path: 'login',
    component: Login,
  }, 
  {
    path: 'sign-up',
    component: Register,
  }, 
  {
    path: 'verify',
    component: Verify,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];