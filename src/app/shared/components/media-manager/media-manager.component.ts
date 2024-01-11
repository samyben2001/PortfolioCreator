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
import { AuthService } from '../../../services/auth.service';
import { MediaManagerContentComponent } from '../media-manager-content/media-manager-content.component';

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

    MediaManagerContentComponent,
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
  tabItems: MenuItem[] = [];

  isAddingImage: boolean = true;
  isAddingVideo: boolean = false;

  @Input() maxMediaSelected: number = 0;
  @Input() actualProjectMedias: Media[] = [];
  @Input() videoIsAvailable: boolean = true;
  @Input() pictureIsAvailable: boolean = true;

  @Output() selectedMediasEvent: EventEmitter<Media[]> = new EventEmitter<
    Media[]
  >();

  @ViewChildren(Checkbox) checks!: QueryList<Checkbox>;
  @ViewChildren(MediaManagerContentComponent)
  mediasManagercontents!: QueryList<MediaManagerContentComponent>;

  constructor() {
    this.user = this.authServ.getUser();
  }

  ngOnInit() {
    this.tabItems = [
      {
        label: 'Images',
        icon: 'pi pi-fw pi-images',
        command: (e) => this.viewPictures(),
        disabled: this.pictureIsAvailable == true ? false : true,
      },
      {
        label: 'Vidéos',
        icon: 'pi pi-fw pi-video',
        command: () => this.viewVideos(),
        disabled: this.videoIsAvailable == true ? false : true,
      },
    ];

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

  stopPropagation($event: any) {
    $event.stopPropagation();
  }

  exit() {
    this.selectedMediasEvent.emit([]);

    this.isAddingVideo = false;
    this.isAddingImage = true;

    this.mediasManagercontents.forEach((component) => {
      component.initializeSelectedMediasToEmpty();
    });
  }

  submit() {
    this.selectedMediasEvent.emit(this.selectedMedias);

    this.isAddingVideo = false;
    this.isAddingImage = true;

    this.mediasManagercontents.forEach((component) => {
      component.initializeSelectedMediasToEmpty();
    });
  }

  //Events Methods
  addMedia($event: Media[]) {
    $event.forEach((media) => {
      if (!this.selectedMedias.includes(media)) {
        this.selectedMedias.push(media);
      }
    });
  }

  removeMedia($event: Media) {
    this.selectedMedias.splice(this.selectedMedias.indexOf($event), 1);
  }

  resetMedias() {
    this.selectedMedias = [];
  }
}
