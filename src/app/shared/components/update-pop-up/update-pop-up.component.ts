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

@Component({
  selector: 'app-update-pop-up',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    CalendarModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  templateUrl: './update-pop-up.component.html',
  styleUrl: './update-pop-up.component.scss',
})
export class UpdatePopUpComponent {
  formBuilder = inject(FormBuilder);

  allUpdateTypes = UpdateType;
  portfolioServ = inject(PortfolioService);
  projectServ = inject(ProjectService);

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
        const p : Project = this.objectToUpdate as Project; 
        p.endingDate = this.group.value.endingDate
        this.objectToUpdate = p
        console.log(this.group.value.endingDate)

        break;
      default:
        break;
    }

    //Check if object is Project or Portfolio
    if ('skill' in this.objectToUpdate!) {
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

  exit() {
    this.updateEvent.emit(null);
  }

  stopPropagation($event: any) {
    $event.stopPropagation();
  }
}
