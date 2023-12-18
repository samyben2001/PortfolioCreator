import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environment';
import { Portfolio, PortfolioCreation } from '../models/portfolio.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  private url = environment.url
  client = inject(HttpClient)

  create(portfolio: PortfolioCreation): Observable<Portfolio> {
    return this.client.post<Portfolio>(this.url + "Portfolio/create", portfolio)
  }

  get(id: number): Observable<Portfolio> | null {
    return this.client.get<Portfolio>(this.url + "Portfolio/getById/" + id)
  }

  getAll(): Observable<Portfolio[]> {
    return this.client.get<Portfolio[]>(this.url + "Portfolio/getAll/")
  }

  getAllByUser(userId: string): Observable<Portfolio[]> {
    return this.client.get<Portfolio[]>(this.url + "Portfolio/getAllByUser/" + userId)
  }

  delete(id: number): Observable<boolean> {
    return this.client.delete<boolean>(this.url + "Portfolio/" + id)
  }
}
