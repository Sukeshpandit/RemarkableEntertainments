import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) { }

  submitContactForm(formData: any): Observable<any> {
    // Placeholder for contact form submission
    return this.http.post('api/contact', formData);
  }
}

