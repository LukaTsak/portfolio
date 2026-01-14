import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-taskbar',
  templateUrl: './taskbar.html',
  imports: [DatePipe],
  styleUrl: './taskbar.scss',
})
export class Taskbar implements OnInit, OnDestroy {
  currentDate = new Date();
  private timerId!: number;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.timerId = window.setInterval(() => {
      this.currentDate = new Date();
      this.cdr.markForCheck();
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timerId);
  }
}
