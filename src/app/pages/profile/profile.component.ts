import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../services/student.service';
import { StepperComponent } from '../../shared/components/stepper/stepper.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StepperComponent, NavbarComponent],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  loading = false;
  error = '';
  profileForm!: ReturnType<FormBuilder['group']>;
  steps = [
    'Student Profile',
    'Question (1 - 6)',
    'Question (7 - 12)',
    'Question (13 - 18)',
    'Question (19 - 24)',
    'Writing Task',
  ];
  currentStep = 0;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      age: ['', Validators.required],
    });
  }

  submit() {
    if (this.profileForm.invalid) {
      this.error = 'Please complete all required fields';
      return;
    }

    this.loading = true;
    this.error = '';

    this.studentService.createStudent(this.profileForm.value).subscribe({
      next: (res) => {
        localStorage.setItem('student_id', res.data.id);
        localStorage.setItem('set_question', res.data.set_question);
        localStorage.setItem('student_answer_id', res.data.student_answer_id);

        this.router.navigate(['/test']);
      },
      error: () => {
        this.error = 'Failed to submit data';
        this.loading = false;
      },
    });
  }

  reset() {
    window.location.reload();
  }
}
