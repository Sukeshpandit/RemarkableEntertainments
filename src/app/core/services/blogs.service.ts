import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Blog } from '../models/blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogsService {

  constructor(private http: HttpClient) { }

  getBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>('assets/data/blogs.json');
  }

  getBlogById(id: string): Observable<Blog> {
    return this.http.get<Blog>(`assets/data/blogs/${id}.json`);
  }
}

