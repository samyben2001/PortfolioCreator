import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment';
import { Skill } from '../models/skill.model';

@Injectable({
  providedIn: 'root'
})
export class SkillService {

  private url = environment.url
  client = inject(HttpClient)

  create(skill: Skill): Observable<Skill> {
    return this.client.post<Skill>(this.url + "Skill/create", skill)
  }

  get(id: number): Observable<Skill> | null {
    return this.client.get<Skill>(this.url + "Skill/" + id)
  }

  getAll(): Observable<Skill[]> {
    return this.client.get<Skill[]>(this.url + "Skill/getAll")
  }

  getAllByPortfolio(portfolioId: number): Observable<Skill[]> {
    return this.client.get<Skill[]>(this.url + "Skill/getAllByPortfolio/" + portfolioId)
  }

  getAllByProject(projectId: number): Observable<Skill[]> {
    return this.client.get<Skill[]>(this.url + "Skill/getAllByProject/" + projectId)
  }

  getAllByUser(userId: string): Observable<Skill[]> {
    return this.client.get<Skill[]>(this.url + "Skill/getAllByUser/" + userId)
  }
}
