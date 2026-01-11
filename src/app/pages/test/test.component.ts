import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StepperComponent } from '../../shared/components/stepper/stepper.component';
import { TimeComponent } from '../../shared/components/time/time.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { QuestionService } from '../../services/question.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, StepperComponent, TimeComponent, NavbarComponent],
  templateUrl: './test.component.html',
})
export class TestComponent implements OnInit, OnDestroy {
  questions: any[] = [];
  currentPage = 1;
  pageSize = 6;
  isLoading = true;
  steps = [
    'Student Profile',
    'Question (1 - 6)',
    'Question (7 - 12)',
    'Question (13 - 18)',
    'Question (19 - 24)',
    'Writing Task',
  ];

  // TIMER
  timer = environment.timerDuration; // Timer duration from environment config
  timerInterval: any;
  readonly TIMER_STORAGE_KEY = 'test_timer_remaining';
  private readonly ANSWERS_STORAGE_KEY = 'test_answers';
  private startTime: number = Date.now();

  // Store selected answers: { questionId: answerId }
  selectedAnswers: Map<number, number> = new Map();

  constructor(
    private questionService: QuestionService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.restoreTimer();
    this.restoreSavedAnswers();
    this.startTimer();
    this.loadQuestions();
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
  }

  @HostListener('window:beforeunload')
  saveTimerBeforeUnload() {
    localStorage.setItem(this.TIMER_STORAGE_KEY, this.timer.toString());
  }

  restoreTimer() {
    const savedTime = localStorage.getItem(this.TIMER_STORAGE_KEY);
    if (savedTime) {
      this.timer = parseInt(savedTime, 10);
    }
  }

  loadQuestions() {
    const studentId = localStorage.getItem('student_id') || '';
    const setQuestion = localStorage.getItem('set_question') || '';

    if (!studentId || !setQuestion) {
      console.error('Missing required parameters: student_id or set_question in localStorage');
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges(); // Force update loading state

    this.questionService.getQuestions(studentId, setQuestion).subscribe({
      next: (response) => {
        this.questions = response;

        this.isLoading = false;

        // Manually trigger change detection
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading questions:', error);
        console.error('Error details:', {
          status: error.status,
          message: error.message,
          url: error.url,
        });
        this.questions = [];
        this.isLoading = false;

        // Manually trigger change detection
        this.cdr.detectChanges();
      },
    });
  }

  // PAGINATION
  get paginatedQuestions() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.questions.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.questions.length / this.pageSize);
  }

  get endIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.questions.length);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    } else if (this.currentPage === this.totalPages) {
      // Save timer before navigating to writing task
      localStorage.setItem(this.TIMER_STORAGE_KEY, this.timer.toString());
      this.router.navigate(['/writing-task']);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // TIMER METHODS
  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
        this.cdr.detectChanges(); // Force UI update every second
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

  get currentStep(): number {
    return this.currentPage;
  }

  // ANSWER SELECTION METHODS
  onAnswerSelected(questionId: number, answerId: number) {
    this.selectedAnswers.set(questionId, answerId);
    this.saveAnswersToLocalStorage();
  }

  isAnswerSelected(questionId: number, answerId: number): boolean {
    return this.selectedAnswers.get(questionId) === answerId;
  }

  restoreSavedAnswers() {
    const savedData = localStorage.getItem(this.ANSWERS_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        this.selectedAnswers.clear();

        if (parsedData.student_answers && Array.isArray(parsedData.student_answers)) {
          parsedData.student_answers.forEach((item: any) => {
            if (item.question_id && item.answer_id !== undefined) {
              this.selectedAnswers.set(item.question_id, item.answer_id);
            }
          });
        }

        if (parsedData.timestamp) {
          this.startTime = parsedData.timestamp;
        }
      } catch (error) {
        console.error('Error restoring saved answers:', error);
      }
    }
  }

  saveAnswersToLocalStorage() {
    const studentId = parseInt(localStorage.getItem('student_id') || '0', 10);

    // Convert Map to array format
    const studentAnswersArray = Array.from(this.selectedAnswers.entries()).map(
      ([questionId, answerId]) => ({
        question_id: questionId,
        answer_id: answerId,
      })
    );

    // Get the last selected answer_id (student_answer_id)
    const lastAnswerId = studentAnswersArray.length > 0
      ? studentAnswersArray[studentAnswersArray.length - 1].answer_id
      : 0;

    // Calculate elapsed time in MM:SS format
    const elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
    const duration = `${minutes}:${seconds}`;

    const answersData = {
      student_id: studentId,
      student_answer_id: lastAnswerId,
      student_answers: studentAnswersArray,
      duration: duration,
      timestamp: this.startTime,
    };

    localStorage.setItem(this.ANSWERS_STORAGE_KEY, JSON.stringify(answersData));
  }
}
