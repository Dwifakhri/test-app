import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private API = `${environment.apiBaseUrl}/student/create`;

  constructor(private http: HttpClient) {}

  createStudent(data: any): Observable<any> {
    return this.http.post(this.API, data);
  }
}
