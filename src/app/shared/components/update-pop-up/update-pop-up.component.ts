import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Portfolio, PortfolioUpdate } from '../../../models/portfolio.model';
import { UpdateType } from '../../../enums/updateType.enum';
import { InputTextModule } from 'primeng/inputtext';
import { PortfolioService } from '../../../services/portfolio.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Project, ProjectUpdate } from '../../../models/project.model';
import { ProjectService } from '../../../services/project.service';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Skill } from '../../../models/skill.model';
import { SkillService } from '../../../services/skill.service';
import { SkillPickerComponent } from '../skill-picker/skill-picker.component';

@Component({
  selector: 'app-update-pop-up',
  standalone: true,
  imports: [
    CommonModule,

    SkillPickerComponent,

    CardModule,
    ButtonModule,
    CalendarModule,
    InputTextModule,
    ReactiveFormsModule,
    AutoCompleteModule,
  ],
  templateUrl: './update-pop-up.component.html',
  styleUrl: './update-pop-up.component.scss',
})
export class UpdatePopUpComponent {
  formBuilder = inject(FormBuilder);

  allUpdateTypes = UpdateType;
  portfolioServ = inject(PortfolioService);
  projectServ = inject(ProjectService);
  skillServ = inject(SkillService);

  skills: Skill[] = [];
  existingSkills: Skill[] = [];

  group: FormGroup = new FormGroup({});

  @Input() objectToUpdate?: Portfolio | Project;
  @Input() updateType?: UpdateType;

  @Output() updateEvent: EventEmitter<Portfolio | Project | null> =
    new EventEmitter<Portfolio | Project | null>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['updateType']) {
      switch (changes['updateType'].currentValue) {
        case UpdateType.Title:
          this.group = new FormGroup({
            title: new FormControl(this.objectToUpdate?.title, [
              Validators.required,
            ]),
          });

          break;

        case UpdateType.Description:
          this.group = new FormGroup({
            description: new FormControl(this.objectToUpdate?.description, [
              Validators.required,
            ]),
          });
          break;

        case UpdateType.EndingDate:
          this.group = new FormGroup({
            endingDate: new FormControl(''),
          });
          break;

        case UpdateType.Skill:
          this.skills = [];
          const p: Project = this.objectToUpdate as Project;
          p.skillIds = [];
          this.objectToUpdate = p;
          this.existingSkills = this.objectToUpdate.skill;
          break;

        default:
          this.group = new FormGroup({});
          break;
      }
    }
  }

  submit() {
    switch (this.updateType) {
      case UpdateType.Title:
        this.objectToUpdate!.title = this.group.value.title;

        break;
      case UpdateType.Description:
        this.objectToUpdate!.description = this.group.value.description;

        break;
      case UpdateType.EndingDate:
        const p: Project = this.objectToUpdate as Project;
        p.endingDate = this.group.value.endingDate;
        this.objectToUpdate = p;

        break;
      case UpdateType.Skill:
        if (this.skills.length! > 0) {
          //sort by id: new skills (id = -1) at the end of the array
          this.skills.sort((a: Skill, b: Skill) => {
            return b.id! - a.id!;
          });

          this.skills.forEach((skill: Skill, i: number) => {
            //Add skill in DB
            if (skill.id == -1) {
              this.skillServ.create(skill).subscribe({
                next: (s) => {
                  this.sendSkillToDB(s, i);
                },
              });
            } else {
              this.sendSkillToDB(skill, i);
            }
          });
        }
        break;
      default:
        break;
    }

    //Check if object is Project or Portfolio
    if (
      'skill' in this.objectToUpdate! &&
      this.updateType != UpdateType.Skill
    ) {
      this.projectServ.update(this.objectToUpdate as ProjectUpdate).subscribe({
        next: (isUpdated) => {
          this.updateEvent.emit(this.objectToUpdate as Project);
        },
      });
    } else {
      this.portfolioServ
        .update(this.objectToUpdate as PortfolioUpdate)
        .subscribe({
          next: (isUpdated) => {
            this.updateEvent.emit(this.objectToUpdate as Portfolio);
          },
        });
    }
  }

  private sendSkillToDB(skill: Skill, i: number) {
    const p: Project = this.objectToUpdate as Project;
    p.skillIds.push(skill.id!);
    this.objectToUpdate = p;

    //Send project to DB after last skill created
    this.projectServ.addSkill(this.objectToUpdate.id, skill.id!).subscribe({
      next: (isUpdated) => {
        if (i == this.skills.length! - 1) {
          this.objectToUpdate = this.objectToUpdate as Project;
          this.objectToUpdate.skill = this.objectToUpdate.skill.concat(
            this.skills
          );
          this.updateEvent.emit(this.objectToUpdate as Project);
        }
      },
    });
  }

  exit() {
    this.updateEvent.emit(null);
  }

  getSkills($event: Skill[]) {
    this.skills = $event;
  }

  stopPropagation($event: any) {
    $event.stopPropagation();
  }
}
