import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StepperComponent } from '../../shared/components/stepper/stepper.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { AnswerService } from '../../services/answer.service';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-writing-task',
  standalone: true,
  imports: [CommonModule, FormsModule, StepperComponent, NavbarComponent],
  templateUrl: './writing-task.component.html',
})
export class WritingTaskComponent implements OnInit, OnDestroy {
  writingText = '';
  steps = [
    'Student Profile',
    'Question (1 - 6)',
    'Question (7 - 12)',
    'Question (13 - 18)',
    'Question (19 - 24)',
    'Writing Task',
  ];
  currentStep = 6;

  // TIMER
  timer = environment.timerDuration; // Timer duration from environment config
  timerInterval: any;
  readonly TIMER_STORAGE_KEY = 'test_timer_remaining';

  constructor(
    private router: Router,
    private answerService: AnswerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.restoreTimer();
    this.startTimer();
    this.loadSavedText();
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
    this.saveTimer();
  }

  @HostListener('window:beforeunload')
  saveTimerBeforeUnload() {
    this.saveTimer();
  }

  restoreTimer() {
    const savedTime = localStorage.getItem(this.TIMER_STORAGE_KEY);
    if (savedTime) {
      this.timer = parseInt(savedTime, 10);
    }
    // If no saved time, timer will use the environment default value
  }

  saveTimer() {
    localStorage.setItem(this.TIMER_STORAGE_KEY, this.timer.toString());
  }

  loadSavedText() {
    const saved = localStorage.getItem('writing_task');
    if (saved) {
      this.writingText = saved;
    }
  }

  saveText() {
    localStorage.setItem('writing_task', this.writingText);
  }

  previous() {
    this.saveText();
    this.saveTimer();
    this.router.navigate(['/test']);
  }

  finish() {
    this.saveText();

    // Get the saved answers from localStorage
    const answersData = localStorage.getItem('test_answers');

    if (!answersData) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No answers found. Please complete the test first.',
      });
      return;
    }

    try {
      const parsedData = JSON.parse(answersData);

      // Add writing task to the answers array with question_id 999
      const writingTaskAnswer = {
        question_id: 999,
        answer_id: this.writingText,
      };

      const submissionData = {
        ...parsedData,
        student_answers: [...parsedData.student_answers, writingTaskAnswer],
      };

      // Submit answers to API
      this.answerService.submitAnswers(submissionData).subscribe({
        next: (response) => {
          // Show success sweet alert
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Your answers have been submitted successfully.',
            confirmButtonColor: '#10b981',
          }).then(() => {
            // Clear saved data from localStorage
            localStorage.removeItem('test_answers');
            localStorage.removeItem('writing_task');
            localStorage.removeItem('test_timer_remaining');

            // Navigate to result page
            this.router.navigate(['/result']);
          });
        },
        error: (error) => {
          console.error('Error submitting answers:', error);
          Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            text: 'An error occurred while submitting your answers. Please try again.',
          });
        },
      });
    } catch (error) {
      console.error('Error parsing answers data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to process your answers. Please try again.',
      });
    }
  }

  // TIMER METHODS
  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
        this.saveTimer(); // Save timer every second
        this.cdr.detectChanges(); // Force UI update
      } else {
        // Timer reached 0, stop the countdown
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.timer / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (this.timer % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
}
