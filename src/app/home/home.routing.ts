// import { AuthenticationComponent } from './authentication.component';
import { HomePage } from './home.page';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { CloudsPage } from '../pages/clouds/clouds.page';
import { ScannerPage } from '../pages/scanner/scanner.page';
import { OverviewPage } from '../pages/overview/overview.page';

export const routes: Routes = [
  { path: '', component: HomePage, data: { state: 'home' },
  children: [
    { path: '', redirectTo: 'overview', pathMatch: 'full' },
    { path: 'clouds', component: CloudsPage, data: { state: 'clouds' }},
    { path: 'scanner', component: ScannerPage, data: { state: 'scanner' }},
    { path: 'overview', component: OverviewPage, data: { state: 'overview' }},
  ]},
];
 
export const routing: ModuleWithProviders = RouterModule.forChild(routes);  