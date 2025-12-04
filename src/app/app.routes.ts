import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { ClientLayout } from './layouts/client-layout/client-layout';
import { DashboardOverview as ClientOverview } from './pages/clients/dashboard-overview/dashboard-overview';
import { ClientTransactions } from './pages/clients/client-transactions/client-transactions';
import { Products } from './pages/clients/products/products';
import { ClientProfile } from './pages/clients/client-profile/client-profile';

import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { DashboardOverview as AdminOverview } from './pages/admin/dashboard-overview/dashboard-overview';
import { AdminTransactions } from './pages/admin/transactions/transactions';
import { RoleManagement } from './pages/admin/role-management/role-management';
import { AdminUsers } from './pages/admin/users/users';
import { Clients } from './pages/admin/clients/clients';
import { AdminSettings } from './pages/admin/settings/settings';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },  
  {
    path: 'admin',
    component: AdminLayout,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: AdminOverview },  
      { path: 'transactions', component: AdminTransactions },
      { path: 'clients', component: Clients },
      { path: 'users', component: AdminUsers },
      { path: 'role-management', component: RoleManagement },
      { path: 'settings', component: AdminSettings },
    ]
  },
  {
    path: 'clients',
    component: ClientLayout,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: ClientOverview },
      { path: 'transactions', component: ClientTransactions },
      { path: 'products', component: Products },
      { path: 'profile', component: ClientProfile },
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];