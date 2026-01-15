import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input } from '@angular/core';

@Component({
  selector: 'app-taskbar',
  templateUrl: './taskbar.html',
  imports: [DatePipe, CommonModule],
  styleUrl: './taskbar.scss',
})
export class Taskbar implements OnInit, OnDestroy {

  @Input() isPdfOpen!: boolean
  @Input() isPdfActive!: boolean
  @Input() isAboutOpen!: boolean
  


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
