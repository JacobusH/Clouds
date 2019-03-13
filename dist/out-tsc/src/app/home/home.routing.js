// import { AuthenticationComponent } from './authentication.component';
import { HomePage } from './home.page';
import { RouterModule } from '@angular/router';
import { CloudsPage } from '../pages/clouds/clouds.page';
import { ScannerPage } from '../pages/scanner/scanner.page';
import { OverviewPage } from '../pages/overview/overview.page';
import { SettingsPage } from '../pages/settings/settings.page';
export var routes = [
    { path: '', component: HomePage, data: { state: 'homePage' },
        children: [
            { path: '', redirectTo: 'overview', pathMatch: 'full' },
            { path: 'clouds', component: CloudsPage, data: { state: 'cloudsPage' } },
            { path: 'scanner', component: ScannerPage, data: { state: 'scannerPage' } },
            { path: 'overview', component: OverviewPage, data: { state: 'overviewPage' } },
            { path: 'settings', component: SettingsPage, data: { state: 'settingsPage' } },
        ] },
];
export var routing = RouterModule.forChild(routes);
//# sourceMappingURL=home.routing.js.map