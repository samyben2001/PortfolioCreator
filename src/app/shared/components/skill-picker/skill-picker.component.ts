import { Component, ElementRef, EventEmitter, Input, NgZone, Output, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
  AutoCompleteSelectEvent,
  AutoCompleteUnselectEvent,
} from 'primeng/autocomplete';
import { Skill } from '../../../models/skill.model';
import { FormControl, FormGroup } from '@angular/forms';
import { SkillService } from '../../../services/skill.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-skill-picker',
  standalone: true,
  imports: [CommonModule, AutoCompleteModule],
  templateUrl: './skill-picker.component.html',
  styleUrl: './skill-picker.component.scss',
})
export class SkillPickerComponent { 
  @ViewChild("skillInput", { read: ElementRef }) skillInput?: ElementRef
  skillServ = inject(SkillService);
  ngZone = inject(NgZone)

  group: FormGroup = new FormGroup({});

  allSkills: Skill[] = [];
  filteredSkills: Skill[] = [];
  selectedSkills: Skill[] = [];

  @Input() existingSkills: Skill[] = [];
  @Output() onSkillChange = new EventEmitter<Skill[]>();

  ngOnInit() {
    this.skillServ.getAll().subscribe({
      next: (skills) => {
        this.allSkills = skills.filter(
          (sk) => !this.existingSkills.find((s) => s.id == sk.id)
        );
      },
    });
    this.group = new FormGroup({
      skills: new FormControl([]),
    });
  }

  ngAfterViewInit(){
    console.log(this.skillInput?.nativeElement.querySelector('#skill-input'))
    // this.skillInput?.nativeElement.querySelector('#skill-input').focus()  
  }

  filterSkill(event: AutoCompleteCompleteEvent) {
    let skill: string = event.query.toUpperCase();

    this.filteredSkills = this.allSkills
      .filter((sk) => sk.name.toUpperCase().indexOf(skill) == 0)
      .sort((a, b) => a.name.localeCompare(b.name));

    if (skill.length >= 1) {
      if (this.filteredSkills.length > 0) {
        if (
          this.filteredSkills.findIndex(
            (sk) => sk.name.toUpperCase() == skill
          ) == -1
        ) {
          this.filteredSkills.unshift({ name: skill, id: -1 });
        }
        return this.filteredSkills;
      } else return (this.filteredSkills = [{ name: skill, id: -1 }]);
    }
    return this.filteredSkills;
  }

  removeSkill(event: AutoCompleteSelectEvent) {
    this.selectedSkills.push(event.value);
    this.onSkillChange.emit(this.selectedSkills);

    this.allSkills.splice(
      this.allSkills.findIndex((s) => s.id == event.value.id),
      1
    );
    return this.allSkills;
  }

  addSkill(event: AutoCompleteUnselectEvent) {
    this.selectedSkills.splice(
      this.selectedSkills.findIndex((s) => s.id == event.value.id),
      1
    );
    this.onSkillChange.emit(this.selectedSkills);

    if (this.allSkills.findIndex((s) => s.id == event.value.id) == -1)
      this.allSkills.push(event.value);

    return this.allSkills;
  }
}
