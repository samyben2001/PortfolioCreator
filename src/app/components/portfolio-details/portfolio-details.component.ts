import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { Portfolio } from '../../models/portfolio.model';
import { PortfolioService } from '../../services/portfolio.service';

import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProjectService } from '../../services/project.service';
import { PortfolioUpdatePopUpComponent } from '../../shared/components/portfolio-update-pop-up/portfolio-update-pop-up.component';
import {
  PortfolioUpdateType,
  ProjectUpdateType,
} from '../../enums/updateType.enum';

@Component({
  selector: 'app-portfolio-details',
  standalone: true,
  imports: [
    CommonModule,

    PortfolioUpdatePopUpComponent,

    RouterModule,
    PanelModule,
    CardModule,
    ButtonModule,
  ],
  templateUrl: './portfolio-details.component.html',
  styleUrl: './portfolio-details.component.scss',
})
export class PortfolioDetailsComponent {
  portfolioServ = inject(PortfolioService);
  projectService = inject(ProjectService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  portfolioUpdateType = PortfolioUpdateType;

  isUpdateActive = false;
  isUpdating = false;
  portfolio?: Portfolio;
  updateType?: PortfolioUpdateType;

  constructor() {
    const portfolioId: number = Number(
      this.route.snapshot.paramMap.get('portfolioId')
    );

    if (portfolioId) {
      this.portfolioServ.get(portfolioId)?.subscribe({
        next: (p) => {
          this.portfolio = p;
        },
      });
    }
  }

  delete($event: Event, id: number) {
    // TODO: Ajouter confirmation
    $event.stopPropagation();

    this.projectService.delete(id).subscribe({
      next: (isDeleted) => {
        if (isDeleted) {
          console.log('project ' + id + ' deleted');
          this.portfolio?.projects.splice(
            this.portfolio?.projects.findIndex((p) => p.id == id),
            1
          );
        }
      },
    });
  }

  toggleUpdate() {
    this.isUpdateActive = !this.isUpdateActive;
  }

  update(type: PortfolioUpdateType) {
    this.updateType = type;
    this.isUpdating = true;
  }

  getUpdatedPortfolio($event: Portfolio) {
    this.portfolio = $event;
	this.isUpdating = false;
  }

  navigateToProjectCreation(id: number) {
    this.router.navigate(['/projectCreation/', id]);
  }

  navigateToProjectDetails(id: number) {
    this.router.navigate(['/project/', id]);
  }
}
