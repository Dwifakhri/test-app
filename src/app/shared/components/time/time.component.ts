import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-time',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './time.component.html',
})
export class TimeComponent implements OnInit, OnDestroy {
  @Input() initialSeconds: number = environment.timerDuration; // Timer duration from environment config
  @Input() storageKey: string = 'timer_remaining';
  @Input() autoStart: boolean = true;

  timer = 0;
  timerInterval: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.restoreTimer();
    if (this.autoStart) {
      this.startTimer();
    }
  }

  ngOnDestroy() {
    this.saveTimer();
    clearInterval(this.timerInterval);
  }

  restoreTimer() {
    const savedTime = localStorage.getItem(this.storageKey);
    if (savedTime) {
      this.timer = parseInt(savedTime, 10);
    } else {
      this.timer = this.initialSeconds;
    }
  }

  saveTimer() {
    localStorage.setItem(this.storageKey, this.timer.toString());
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
        this.saveTimer();
        this.cdr.detectChanges();
      } else {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
  }

  resetTimer() {
    this.timer = this.initialSeconds;
    this.saveTimer();
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.timer / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (this.timer % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  get remainingSeconds(): number {
    return this.timer;
  }
}
