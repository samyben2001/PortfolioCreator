import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import {
  Portfolio,
  PortfolioUpdate,
} from '../../../models/portfolio.model';
import { PortfolioUpdateType } from '../../../enums/updateType.enum';
import { InputTextModule } from 'primeng/inputtext';
import { PortfolioService } from '../../../services/portfolio.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-portfolio-update-pop-up',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  templateUrl: './portfolio-update-pop-up.component.html',
  styleUrl: './portfolio-update-pop-up.component.scss',
})
export class PortfolioUpdatePopUpComponent {
  portfolioUpdateType = PortfolioUpdateType;
  portfolioServ = inject(PortfolioService);
  formBuilder = inject(FormBuilder);

  group: FormGroup = new FormGroup({});

  @Input() portfolioToUpdate?: Portfolio;
  @Input() updateType?: PortfolioUpdateType;

  @Output() updateEvent: EventEmitter<Portfolio> =
    new EventEmitter<Portfolio>();

  constructor() {
    // FIXME: DETECT when update type has value
  }

  submit() {
    switch (this.updateType) {
      case PortfolioUpdateType.Title:
        console.log(this.group.value.title);

        this.portfolioToUpdate!.title = this.group.value.title;

        console.log(this.portfolioToUpdate);

        this.portfolioServ
          .update(this.portfolioToUpdate as PortfolioUpdate)
          .subscribe({
            next: (p) => {
              this.updateEvent.emit(p);
            },
          });
        break;
      case PortfolioUpdateType.Description:
        this.portfolioToUpdate!.description = this.group.value.description;
        this.portfolioServ
          .update(this.portfolioToUpdate as PortfolioUpdate)
          .subscribe({
            next: (p) => {
              this.updateEvent.emit(p);
            },
          });
        break;
      default:
        break;
    }
  }
}
