import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { PortfolioCreationComponent } from './components/portfolio-creation/portfolio-creation.component';
import { ProjectCreationComponent } from './components/project-creation/project-creation.component';
import { PortfolioViewerComponent } from './components/portfolios-viewer/portfolios-viewer.component';
import { PortfolioDetailsComponent } from './components/portfolio-details/portfolio-details.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';

export const routes: Routes =
    [
        { path: '', component: HomeComponent, pathMatch: 'full' },
        { path: 'register', component: RegisterComponent },
        { path: 'login', component: LoginComponent },
        { path: 'portfolioCreation', component: PortfolioCreationComponent },
        { path: 'projectCreation/:portfolioId', component: ProjectCreationComponent },
        { path: 'portfolios/:userId', component: PortfolioViewerComponent },
        { path: 'portfolio/:portfolioId', component: PortfolioDetailsComponent },
        { path: 'project/:projectId', component: ProjectDetailsComponent },
    ];
