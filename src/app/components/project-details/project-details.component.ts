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
import { MediaManagerComponent } from '../../shared/components/media-manager/media-manager.component';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    CommonModule,

    UpdatePopUpComponent,
    MediaManagerComponent,

    PanelModule,
    ChipModule,
    ImageModule,
    CarouselModule,
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
  isMediaUpdating = false;
  updateType?: UpdateType;

  constructor() {}

  ngOnInit() {
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
    if (type == UpdateType.Media) {
      this.isMediaUpdating = true;
    } else {
      this.updateType = type;
      this.isUpdating = true;
    }
  }

  getUpdatedProject($event: any) {
    if ($event != null) {
      this.project = $event;
    }
    this.updateType = undefined;
    this.isUpdating = false;
  }

  getNewMedias($event: Media[]) {
    this.isMediaUpdating = false;
    $event.forEach(media => {
      this.projectServ.addMedia(this.project!.id, media.id).subscribe({
      next:()=>{
        this.project?.media.push(media)
        switch (media.mediaTypeId) {
          case 1:
            this.images.push(media);
            break;

          case 2:
            this.videos.push(media);
            break;

          default:
            break;
        }
      }
      })
    });
  }

  deleteMedia($event: Event, id: number) {
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
      },
    });
  }

  deleteSkill($event: Event, id: number) {
    this.projectServ.removeSkill(this.project!.id, id).subscribe({
      next: (r) => {
        this.project?.skill.splice(
          this.project.skill.findIndex((s) => s.id == id),
          1
        );
      },
    });
  }
}
