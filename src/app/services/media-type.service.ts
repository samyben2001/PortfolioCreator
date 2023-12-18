import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environment';
import { MediaType } from '../models/mediaType.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaTypeService {

  private url = environment.url
  client = inject(HttpClient)

  create(mediaType: MediaType): Observable<MediaType> {
    return this.client.post<MediaType>(this.url + "MediaType/create", mediaType)
  }

  get(id: number): Observable<MediaType> | null {
    return this.client.get<MediaType>(this.url + "MediaType/" + id)
  }

  getAll(): Observable<MediaType[]> {
    return this.client.get<MediaType[]>(this.url + "MediaType/getAll/")
  }
}
