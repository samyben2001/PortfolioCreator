import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Checkbox, CheckboxModule } from 'primeng/checkbox';
import { ContextMenuModule } from 'primeng/contextmenu';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { Media } from '../../../models/media.model';
import { AuthService } from '../../../services/auth.service';
import { CloudinaryService } from '../../../services/cloudinary.service';
import { MediaService } from '../../../services/media.service';

@Component({
  selector: 'app-media-manager-content',
  standalone: true,
  imports: [
    CommonModule,
    FileUploadModule,
    ImageModule,
    CheckboxModule,
    ContextMenuModule,
  ],
  templateUrl: './media-manager-content.component.html',
  styleUrl: './media-manager-content.component.scss',
})
export class MediaManagerContentComponent {
  authServ = inject(AuthService);
  mediaServ = inject(MediaService);
  cloudinaryServ = inject(CloudinaryService);
  cdRef = inject(ChangeDetectorRef);

  user: any;

  @Input() mediasType: number = 0;
  @Input() medias: Media[] = [];

  @Input() maxMediaSelected: number = 0;
  @Input() actualMediaSelected: number = 0;

  selectedMedias: Media[] = [];
  @Output() addMediasEvent: EventEmitter<Media[]> = new EventEmitter<Media[]>();
  @Output() removeMediasEvent: EventEmitter<Media> = new EventEmitter<Media>();
  @Output() resetMediasEvent: EventEmitter<Media> = new EventEmitter();

  @ViewChildren(Checkbox) checks!: QueryList<Checkbox>;

  constructor() {
    this.user = this.authServ.getUser();
  }

  selectMedia(media: Media, check: Checkbox) {
    const i = this.selectedMedias.indexOf(media);

    if (i == -1) {
      if (this.selectedMedias.length + this.actualMediaSelected < this.maxMediaSelected) {
        check.writeValue(true);
        check.value = true;
        this.selectedMedias.push(media);
        this.addMediasEvent.emit(this.selectedMedias);
      }
    } else {
      check.writeValue(false);
      check.value = false;
      this.removeMediasEvent.emit(this.selectedMedias[i]);
      this.selectedMedias.splice(i, 1);

    }
  }

  addMedia(event: any, upload: any) {
    const files: FileList = event.currentFiles! as FileList;

    for (let i = 0; i < files.length; i++) {
      //creation de l'objet média aver URL vide
      let m: Media = {
        id: -1,
        title: files[i].name.split('.').slice(0, -1).join('.'),
        url: 'inconnue',
        mediaTypeId: this.mediasType,
        userId: this.user.Id,
      };

      if (this.mediasType == 1) {
        //Si le media est une image => envoi à cloudinary puis à la DB
        this.cloudinaryServ.upload(files[i]).subscribe({
          next: (x: any) => {
            m.url = x.url;
            this.sendToDB(m);
          },
          error: (e: any) => {
            console.log(e);
          },
        });
      } else {
        //envoi direct des medias à la DB
        this.sendToDB(m);
      }

      upload.clear();
    }
  }

  sendToDB(media: Media) {
    this.mediaServ.create(media).subscribe({
      next: (m) => {
        this.medias.push(m);

        if (this.selectedMedias.length < this.maxMediaSelected) {
          this.selectedMedias.push(m);
          this.addMediasEvent.emit(this.selectedMedias);
          this.cdRef.detectChanges();
          this.checks.map((c) => {
            if (c.name == media.title) {
              c.writeValue(true);
              c.value = true;
            }
          });
        }
      },
    });
  }

  initializeSelectedMediasToEmpty() {
    this.checks.forEach((check) => {
      check.writeValue(false);
      check.value = false;
    });
    this.selectedMedias = [];

    this.resetMediasEvent.emit();
  }
}
