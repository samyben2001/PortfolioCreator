import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ProjectCreation } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';
import { MediaManagerComponent } from '../../shared/components/media-manager/media-manager.component';
import { Media } from '../../models/media.model';
import {
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { SkillService } from '../../services/skill.service';
import { Skill } from '../../models/skill.model';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { ImageModule } from 'primeng/image';
import { SkillPickerComponent } from '../../shared/components/skill-picker/skill-picker.component';

@Component({
  selector: 'app-project-creation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    MediaManagerComponent,
    SkillPickerComponent,

    InputTextModule,
    AutoCompleteModule,
    InputTextareaModule,
    ButtonModule,
    CardModule,
    CalendarModule,
    ImageModule,
  ],
  templateUrl: './project-creation.component.html',
  styleUrl: './project-creation.component.scss',
})
export class ProjectCreationComponent {
  formBuilder = inject(FormBuilder);
  projectServ = inject(ProjectService);
  skillServ = inject(SkillService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  groups: FormGroup[] = [];

  projects: ProjectCreation[] = [];

  selectedMediasByProj: Map<number, Media[]> = new Map<number, Media[]>();
  selectedSkillsByProj: Map<number, Skill[]> = new Map<number, Skill[]>();

  isAddingMedia: boolean = false;
  allProjectsValids: boolean = true;
  index: number = -1;

  constructor() {
    this.groups.push(this.addNewForm());
  }

  private addNewForm(): FormGroup {
    let form: FormGroup = this.formBuilder.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
      endingDate: [null],
      selectedSkills: [[]],
    });

    this.projects.push(this.initProject());
    this.selectedMediasByProj.set(this.projects.length - 1, []);
    this.selectedSkillsByProj.set(this.projects.length - 1, []);
    return form;
  }

  private initProject(): ProjectCreation {
    return {
      title: '',
      description: '',
      endingDate: undefined,
      portfolioId: Number(this.route.snapshot.paramMap.get('portfolioId')),
      mediaIds: [],
      skillIds: [],
    };
  }

  addMedia(index: number) {
    this.isAddingMedia = true;
    this.index = index;
  }

  getMedias(medias: Media[]) {
    this.selectedMediasByProj.set(
      this.index,
      this.selectedMediasByProj.get(this.index)?.concat(medias)!
    );

    medias.forEach((media) => {
      if (!this.projects[this.index].mediaIds.includes(media.id)) {
        this.projects[this.index].mediaIds.push(media.id);
      }
    });

    this.index = -1;
    this.isAddingMedia = false;
  }

  getSkills($event: Skill[], index: number) {
    this.selectedSkillsByProj.set(index, $event);
  }

  addNewProject() {
    this.groups.push(this.addNewForm());
  }

  submitAll() {
    this.groups.forEach((group, i) => {
      this.submit(group, i);
    });

    if (!this.allProjectsValids) {
      console.log('Tous les projets ne sont pas valides');
      this.allProjectsValids = true;
    }
  }

  private submit(group: FormGroup, index: number) {
    if (group.valid) {
      this.projects[index].title = group.value.title;
      this.projects[index].description = group.value.description;
      this.projects[index].endingDate = group.value.endingDate;

      if (this.selectedSkillsByProj.get(index)?.length! <= 0)
        this.sendProjectToDB(this.projects[index]);
      else {
        //sort by id: new skills (id = -1) at the end of the array
        this.selectedSkillsByProj.get(index)?.sort((a: Skill, b: Skill) => {
          return b.id! - a.id!;
        });

        this.selectedSkillsByProj
          .get(index)
          ?.forEach((skill: Skill, i: number) => {
            //add new skill to DB if not already present
            if (skill.id == -1) {
              this.skillServ.create(skill).subscribe({
                next: (s) => {
                  this.projects[index].skillIds.push(s.id!);

                  if (i == this.selectedSkillsByProj.get(index)?.length! - 1) {
                    //Send project to DB after last skill created
                    this.sendProjectToDB(this.projects[index]);
                  }
                },
              });
            } else {
              this.projects[index].skillIds.push(skill.id!);

              if (i == this.selectedSkillsByProj.get(index)?.length! - 1) {
                //Send project to DB after last skill created
                this.sendProjectToDB(this.projects[index]);
              }
            }
          });
      }
    } else {
      this.allProjectsValids = false;
    }
  }

  private sendProjectToDB(project: ProjectCreation) {
    this.projectServ.create(project).subscribe({
      next: (p) => {
        this.router.navigate(['/project/', p.id]).then(() => {
          alert('Le projet ' + p.title + ' a bien été créé');
        });
      },
    });
  }
}
