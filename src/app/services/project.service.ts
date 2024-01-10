import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment';
import {
  Project,
  ProjectCreation,
  ProjectUpdate,
} from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private url = environment.url;
  client = inject(HttpClient);

  create(projet: ProjectCreation): Observable<Project> {
    return this.client.post<Project>(this.url + 'Project/create', projet);
  }

  get(id: number): Observable<Project> | null {
    return this.client.get<Project>(this.url + 'Project/getById/' + id);
  }

  getAll(): Observable<Project[]> {
    return this.client.get<Project[]>(this.url + 'Project/getAll/');
  }

  getAllByPortfolio(portfolioId: number): Observable<Project[]> {
    return this.client.get<Project[]>(
      this.url + 'Project/getAllByPortfolio/' + portfolioId
    );
  }

  getAllByUser(userId: string): Observable<Project[]> {
    return this.client.get<Project[]>(
      this.url + 'Project/getAllByUser/' + userId
    );
  }

  update(project: ProjectUpdate): Observable<Project> {
    return this.client.patch<Project>(this.url + 'Project/', project);
  }

  delete(id: number): Observable<boolean> {
    return this.client.delete<boolean>(this.url + 'Project/' + id);
  }

  addMedia(id: number, mediaId: number): Observable<boolean> {
    return this.client.post<boolean>(
      this.url + 'Project/' + id + '/AddMedia',
      mediaId
    );
  }

  addSkill(id: number, skillId: number): Observable<boolean> {
    return this.client.post<boolean>(
      this.url + 'Project/' + id + '/AddSkill',
      skillId
    );
  }

  removeMedia(id: number, mediaId: number): Observable<boolean> {
    const options = {
      body: {
        id: mediaId,
      },
    };
    return this.client.delete<boolean>(
      this.url + 'Project/' + id + '/RemoveMedia/',
      options
    );
  }

  removeSkill(id: number, skillId: number): Observable<boolean> {
    const options = {
      body: {
        id: skillId,
      },
    };
    return this.client.delete<boolean>(
      this.url + 'Project/' + id + '/RemoveSkill/',
      options
    );
  }
}
