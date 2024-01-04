import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';
import { Media } from '../../models/media.model';

import { PanelModule } from 'primeng/panel';
import { ChipModule } from 'primeng/chip';
import { ImageModule } from 'primeng/image';
import { CarouselModule, CarouselPageEvent } from 'primeng/carousel';
import { UpdatePopUpComponent } from '../../shared/components/update-pop-up/update-pop-up.component';
import { UpdateType } from '../../enums/updateType.enum';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    CommonModule,
    PanelModule,
    ChipModule,
    ImageModule,
    CarouselModule,
    UpdatePopUpComponent,
    ButtonModule,
  ],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
})
export class ProjectDetailsComponent {
  projectServ = inject(ProjectService);
  route = inject(ActivatedRoute);

  allUpdateTypes = UpdateType;

  project?: Project;
  images: Media[] = [];
  videos: Media[] = [];

  isUpdateActive = false;
  isUpdating = false;
  updateType?: UpdateType;

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

  toggleUpdate() {
    this.isUpdateActive = !this.isUpdateActive;
  }

  update(type: UpdateType) {
    this.updateType = type;
    this.isUpdating = true;
  }

  getUpdatedProject($event: any) {
    if ($event != null) {
      this.project = $event;
    }

    this.isUpdating = false;
  }

  deleteMedia($event: Event, id: number) {
    console.log(this.project);
    const mediaToDelete = this.project?.media.splice(
      this.project.media.findIndex((m) => m.id == id),
      1
    )!;

    this.projectServ.removeMedia(this.project!.id, id).subscribe({
      next: (r) => {
        switch (mediaToDelete[0].mediaTypeId) {
          case 1:
            this.images.splice(
              this.images.findIndex((i) => (i.id = mediaToDelete[0].id)),
              1
            );
            break;

          case 2:
            this.videos.splice(
              this.images.findIndex((i) => (i.id = mediaToDelete[0].id)),
              1
            );
            break;

          default:
            break;
        }
        console.log('media deleted: ', r);
      },
    });
  }

  deleteSkill($event: Event, id: number) {
    console.log(this.project);
    this.project?.skill.splice(
      this.project.skill.findIndex((s) => s.id == id),
      1
    );

    this.projectServ.removeSkill(this.project!.id, id).subscribe({
      next: (r) => {
        console.log('skill deleted: ', r);
      },
    });
  }
}
