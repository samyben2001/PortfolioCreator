import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

import { Media } from '../models/media.model';
import { CloudinaryService } from './cloudinary.service';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  private url = environment.url
  client = inject(HttpClient)

  cloudinaryServ = inject(CloudinaryService)

  create(media: Media): Observable<Media> {
    return this.client.post<Media>(this.url + "Media/create", media)
  }

  get(id: number): Observable<Media> | null {
    return this.client.get<Media>(this.url + "Media/" + id)
  }

  getAll(): Observable<Media[]> {
    return this.client.get<Media[]>(this.url + "Media/getAll/")
  }

  getAllByProject(projectId: number): Observable<Media[]> {
    return this.client.get<Media[]>(this.url + "Media/getAllByProject/" + projectId)
  }

  getAllByUser(userId: string): Observable<Media[]> {
    return this.client.get<Media[]>(this.url + "Media/getAllByUser/" + userId)
  }

  getAllByUserAndMediaType(userId: string, mediaTypeId: number): Observable<Media[]> {
    return this.client.get<Media[]>(this.url + "Media/getAllByUserAndMediaType/" + userId + "/"+ mediaTypeId)
  }

  delete(id: number): Observable<boolean> {
    return this.client.delete<boolean>(this.url + "Media/" + id)
  }
  
}
