import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environment';
import { Portfolio, PortfolioCreation, PortfolioUpdate } from '../models/portfolio.model';
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

  update(portfolio: PortfolioUpdate): Observable<Portfolio> {
    return this.client.patch<Portfolio>(this.url + "Portfolio/", portfolio)
  }

  delete(id: number): Observable<boolean> {
    return this.client.delete<boolean>(this.url + "Portfolio/" + id)
  }
}
