import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PortfolioService } from '../../services/portfolio.service';
import { AuthService } from '../../services/auth.service';
import { Portfolio, PortfolioCreation } from '../../models/portfolio.model';
import { ProjectCreation, Project } from '../../models/project.model';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { MediaManagerComponent } from '../../shared/components/media-manager/media-manager.component';
import { Media } from '../../models/media.model';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-portfolio-creation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MediaManagerComponent,
    
    InputTextModule,
    ButtonModule,
    CardModule,
    ImageModule,
  ],
  templateUrl: './portfolio-creation.component.html',
  styleUrl: './portfolio-creation.component.scss',
})
export class PortfolioCreationComponent {
  portfolioServ = inject(PortfolioService);
  authService = inject(AuthService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);

  user: any;
  group: FormGroup;
  portfolio: PortfolioCreation;
  projects: Project[] = [];

  media: Media | undefined;
  isAddingMedia: boolean = false;
  isAddingProject: boolean = true;

  constructor() {
    this.user = this.authService.getUser();

    this.portfolio = {
      title: '',
      description: '',
      projects: [],
      userId: this.user.Id,
      mediaId: undefined
    };

    this.group = this.formBuilder.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
    });
  }

  addProject() {
    this.isAddingProject = true;
  }

  getProject(project: Project) {
    this.projects.push(project);
    console.log(this.projects);
    this.isAddingProject = false;
  }

  addMedia() {
    this.isAddingMedia = true;
  }

  getMedias(medias: Media[]) {
    if(medias.length > 0){
      this.media = medias[0]
      this.portfolio.mediaId = this.media.id;
    }
    this.isAddingMedia = false;
  }

  submit() {
    if (this.group.valid) {
      this.portfolio.title = this.group.value.title;
      this.portfolio.description = this.group.value.description;

      //Add Portfolio to DB
      this.portfolioServ.create(this.portfolio).subscribe({
        next: (p: Portfolio) => {
          this.router.navigate(['/projectCreation', p.id]);

          //TODO: Message de validation
        },
        error: (err: any) => {
          console.log(err);
        },
      });
    }
  }
}
