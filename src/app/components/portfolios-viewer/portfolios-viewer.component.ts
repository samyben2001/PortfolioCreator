import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { PortfolioService } from '../../services/portfolio.service';
import { Portfolio } from '../../models/portfolio.model';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-portfolio-viewer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    PanelModule,
    ImageModule,
  ],
  templateUrl: './portfolios-viewer.component.html',
  styleUrl: './portfolios-viewer.component.scss',
})
export class PortfolioViewerComponent {
  portfolioServ = inject(PortfolioService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  portfolios: Portfolio[] = [];

  constructor() {
    const userId = this.route.snapshot.paramMap.get('userId');

    if (userId) {
      this.portfolioServ.getAllByUser(userId).subscribe({
        next: (p) => {
          this.portfolios = p;
        },
      });
    }
  }

  delete($event: Event, id: number) {
    // TODO: Ajouter confirmation
    $event.stopPropagation();

    this.portfolioServ.delete(id).subscribe({
      next: (isDeleted) => {
        if (isDeleted) {
          console.log('portfolio ' + id + ' deleted');
          this.portfolios.splice(
            this.portfolios.findIndex((p) => p.id == id),
            1
          );
        }
      },
    });
  }

  navigateToPortfolioCreation() {
    this.router.navigate(['/portfolioCreation']);
  }

  navigateToPortfolio(id: number) {
    this.router.navigate(['/portfolio/', id]);
  }
}
