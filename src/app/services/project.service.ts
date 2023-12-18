import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment';
import { Project, ProjectCreation } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private url = environment.url
  client = inject(HttpClient)

  create(projet: ProjectCreation): Observable<Project> {
    return this.client.post<Project>(this.url + "Project/create", projet)
  }

  get(id: number): Observable<Project> | null {
    return this.client.get<Project>(this.url + "Project/getById/" + id)
  }

  getAll(): Observable<Project[]> {
    return this.client.get<Project[]>(this.url + "Project/getAll/")
  }

  getAllByPortfolio(portfolioId: number): Observable<Project[]> {
    return this.client.get<Project[]>(this.url + "Project/getAllByPortfolio/" + portfolioId)
  }

  getAllByUser(userId: string): Observable<Project[]> {
    return this.client.get<Project[]>(this.url + "Project/getAllByUser/" + userId)
  }

  delete(id: number): Observable<boolean> {
    return this.client.delete<boolean>(this.url + "Project/" + id)
  }
}
