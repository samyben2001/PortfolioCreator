import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';
import { Media } from '../../models/media.model';

import { PanelModule } from 'primeng/panel';
import { ChipModule } from 'primeng/chip';
import { ImageModule } from 'primeng/image';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, PanelModule, ChipModule, ImageModule, CarouselModule],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
})
export class ProjectDetailsComponent {
  projectServ = inject(ProjectService);
  route = inject(ActivatedRoute);

  project?: Project;
  images: Media[] = [];
  videos: Media[] = [];

  constructor() {
    const projectid: number = Number(
      this.route.snapshot.paramMap.get('projectId')
    );

    this.projectServ.get(projectid)?.subscribe({
      next: (p) => {
        this.project = p;
        this.project.media.forEach((m) => {
          switch (m.mediaTypeId) {
            case 1:
              this.images.push(m);
              break;

            case 2:
              this.videos.push(m);
              break;

            default:
              break;
          }
        });
      },
    });
  }
}
