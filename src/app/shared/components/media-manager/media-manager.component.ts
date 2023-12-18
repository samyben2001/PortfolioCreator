import {
  Component,
  Output,
  inject,
  EventEmitter,
  ViewChildren,
  QueryList,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MediaService } from '../../../services/media.service';
import { CloudinaryService } from '../../../services/cloudinary.service';
import { Media } from '../../../models/media.model';

import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { TabMenuModule } from 'primeng/tabmenu';
import { ImageModule } from 'primeng/image';
import { Checkbox, CheckboxModule } from 'primeng/checkbox';
import { MenuItem } from 'primeng/api';
import { ContextMenuModule } from 'primeng/contextmenu';
import { AuthService } from '../../../services/auth.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-media-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    FileUploadModule,
    CardModule,
    TabMenuModule,
    ImageModule,
    CheckboxModule,
    ContextMenuModule,
  ],
  templateUrl: './media-manager.component.html',
  styleUrl: './media-manager.component.scss',
})
export class MediaManagerComponent {
  authServ = inject(AuthService);
  mediaServ = inject(MediaService);
  cloudinaryServ = inject(CloudinaryService);
  cdRef = inject(ChangeDetectorRef);

  user: any;
  pictures: Media[] = [];
  videos: Media[] = [];
  selectedMedias: Media[] = [];
  tabItems: MenuItem[] | undefined;
  contextItems: MenuItem[] | undefined;
  activeTabItem: MenuItem | undefined;

  isAddingImage: boolean = true;
  isAddingVideo: boolean = false;

  @Input() maxMediaSelected: number = 0;

  @Output() selectedMediasEvent: EventEmitter<Media[]> = new EventEmitter<
    Media[]
  >();

  @ViewChildren(Checkbox) checks!: QueryList<Checkbox>;

  constructor() {
    this.user = this.authServ.getUser();

    this.tabItems = [
      {
        label: 'Images',
        icon: 'pi pi-fw pi-images',
        command: (e) => this.viewPictures(),
      },
      {
        label: 'Vidéos',
        icon: 'pi pi-fw pi-video',
        command: () => this.viewVideos(),
      },
    ];
    this.activeTabItem = this.tabItems[0];

    this.contextItems = [
      {
        label: 'Delete',
        icon: 'pi pi-fw pi-trash',
      },
    ];
  }

  ngAfterViewInit() {
    console.log(this.checks);
  }

  ngOnInit() {
    console.log(this.maxMediaSelected);

    //Get pictures of User
    this.mediaServ.getAllByUserAndMediaType(this.user.Id, 1).subscribe({
      next: (m) => {
        this.pictures = m;
      },
    });

    //Get videos of User
    this.mediaServ.getAllByUserAndMediaType(this.user.Id, 2).subscribe({
      next: (m) => {
        this.videos = m;
      },
    });
  }

  viewPictures() {
    this.isAddingVideo = false;
    this.isAddingImage = true;
  }

  viewVideos() {
    this.isAddingVideo = true;
    this.isAddingImage = false;
  }

  selectMedia(media: Media, check: Checkbox) {
    const i = this.selectedMedias.indexOf(media);

    if (i == -1) {
      if (this.selectedMedias.length < this.maxMediaSelected) {
        check.writeValue(true);
        check.value = true;
        this.selectedMedias.push(media);
      }
    } else {
      check.writeValue(false);
      check.value = false;
      this.selectedMedias.splice(i, 1);
    }
  }

  addMedia(event: any, mediaType: number, upload: any) {
    const files: FileList = event.currentFiles! as FileList;

    for (let i = 0; i < files.length; i++) {
      //creation de l'objet média aver URL vide
      let m: Media = {
        id: -1,
        title: files[i].name.split('.').slice(0, -1).join('.'),
        url: 'inconnu',
        mediaTypeId: mediaType,
        userId: this.user.Id,
      };

      if (mediaType == 1) {
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
        switch (m.mediaTypeId) {
          case 1: //image
            this.pictures.push(m);
            break;
          case 2: //video
            this.videos.push(m);
            break;
          case 3: //exteral link
          default:
            break;
        }

        if (this.selectedMedias.length < this.maxMediaSelected) {
          this.selectedMedias.push(m);
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

  stopPropagation($event: any) {
    $event.stopPropagation();
  }

  exit() {
    this.selectedMediasEvent.emit([]);

    this.isAddingVideo = false;
    this.isAddingImage = true;

    this.initializeSelectedMediasToEmpty();
  }

  submit() {
    this.selectedMediasEvent.emit(this.selectedMedias);

    this.isAddingVideo = false;
    this.isAddingImage = true;

    this.initializeSelectedMediasToEmpty();
  }

  private initializeSelectedMediasToEmpty() {
    this.checks.forEach((check) => {
      check.writeValue(false);
      check.value = false;
    });
    this.selectedMedias = [];
  }
}
