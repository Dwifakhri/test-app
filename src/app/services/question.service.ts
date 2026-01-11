import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private API = `${environment.apiBaseUrl}/question/list`;

  constructor(private http: HttpClient) {}

  getQuestions(studentId: string, setQuestion: string): Observable<any> {
    return this.http.get(`${this.API}?student_id=${studentId}&set_question=${setQuestion}`);
  }
}
