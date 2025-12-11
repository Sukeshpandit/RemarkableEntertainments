import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CaseStudy } from '../models/case-study.model';

@Injectable({
  providedIn: 'root'
})
export class WorkService {

  constructor(private http: HttpClient) { }

  getWorkItems(): Observable<CaseStudy[]> {
    return this.http.get<CaseStudy[]>('assets/data/work.json');
  }

  getCaseStudyById(id: string): Observable<CaseStudy> {
    return this.http.get<CaseStudy>(`assets/data/case-studies/${id}.json`);
  }
}

