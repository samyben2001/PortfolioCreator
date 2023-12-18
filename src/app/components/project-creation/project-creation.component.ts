import { Component, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
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
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SkillService } from '../../services/skill.service';
import { Skill } from '../../models/skill.model';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-project-creation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MediaManagerComponent,
    InputTextModule,
    InputTextareaModule,
    AutoCompleteModule,
    FormsModule,
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
  document = inject(DOCUMENT);

  groups: FormGroup[] = [];

  projects: ProjectCreation[] = [];
  selectedMediasByProj: Map<number, Media[]> = new Map<number, Media[]>();

  isAddingMedia: boolean = false;
  allProjectsValids: boolean = true;
  index: number = -1;
  allSkills: Skill[] = [];
  filteredSkills: Skill[] = [];

  constructor() {
    this.groups.push(this.addNewForm());

    this.skillServ.getAll().subscribe({
      next: (s) => {
        this.allSkills = s;
      },
    });
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
    this.selectedMediasByProj.set(this.index, medias);

    medias.forEach((media) => {
      if (!this.projects[this.index].mediaIds.includes(media.id)) {
        this.projects[this.index].mediaIds.push(media.id);
      }
      console.log(this.projects[this.index].mediaIds);
    });

    this.index = -1;
    this.isAddingMedia = false;
  }

  filterSkill(event: any) {
    let skill: string = event.query.toUpperCase();
    this.filteredSkills = this.allSkills.filter(
      (sk) => sk.name.toUpperCase().indexOf(skill) == 0
    );

    if (this.filteredSkills.length > 0) {
      if (
        this.filteredSkills.findIndex((sk) => sk.name.toUpperCase() == skill) ==
        -1
      )
        this.filteredSkills.unshift({ name: skill, id: -1 });

      return this.filteredSkills;
    } else return (this.filteredSkills = [{ name: skill, id: -1 }]);
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

      group.value.selectedSkills.sort((a: Skill, b: Skill) => {
        return b.id! - a.id!;
      }); //sort by id: new skills (id = -1) at the end of the array

      group.value.selectedSkills.forEach((skill: Skill, i: number) => {
        //add new skill to DB if not already present
        if (skill.id == -1) {
          this.skillServ.create(skill).subscribe({
            next: (s) => {
              this.projects[index].skillIds.push(s.id!);
              this.allSkills.push(s);

              if (i == group.value.selectedSkills.length - 1) {
                //Send project to DB after last skill created
                this.sendProjectToDB(this.projects[index]);
              }
            },
          });
        } else {
          this.projects[index].skillIds.push(skill.id!);

          if (i == group.value.selectedSkills.length - 1) {
            //Send project to DB after last skill created
            this.sendProjectToDB(this.projects[index]);
          }
        }
      });
    } else {
      this.allProjectsValids = false;
    }
  }

  private sendProjectToDB(project: ProjectCreation) {
    this.projectServ.create(project).subscribe({
      next: (p) => {
        this.router.navigate(['/project/', p.id]);
      },
    });
  }
}