import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AnswerService {
  private API = `${environment.apiBaseUrl}/studentanswer/create`;

  constructor(private http: HttpClient) {}

  submitAnswers(answersData: any): Observable<any> {
    const formData = new FormData();

    // Add basic fields
    formData.append('student_id', answersData.student_id.toString());
    formData.append('student_answer_id', answersData.student_answer_id.toString());
    formData.append('duration', answersData.duration);

    if (answersData.timestamp) {
      formData.append('timestamp', answersData.timestamp.toString());
    }

    // Add student_answers as JSON string
    formData.append('student_answers', JSON.stringify(answersData.student_answers));

    return this.http.post(this.API, formData);
  }
}
