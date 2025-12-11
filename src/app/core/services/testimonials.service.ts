import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Testimonial } from '../models/testimonial.model';

@Injectable({
  providedIn: 'root'
})
export class TestimonialsService {

  constructor(private http: HttpClient) { }

  getTestimonials(): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>('assets/data/testimonials.json');
  }
}

