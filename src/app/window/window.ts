import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-window',
  templateUrl: './window.html',
  styleUrl: './window.scss',
})
export class Window implements AfterViewInit, OnDestroy {
  // spawn in "percent-ish" values around center
  spawnX = 50 + Math.floor(Math.random() * 12 - 6);
  spawnY = 50 + Math.floor(Math.random() * 10 - 5);

  @ViewChild('win', { static: true }) win!: ElementRef<HTMLElement>;

  // These are size values (string so they can be px / % / calc / vw etc.)
  windowX: string = '60%';
  windowY: string = '30%';

  private startX = 0;
  private startY = 0;

  private startW = 0;
  private startH = 0;

  private startLeft = 0;
  private startTop = 0;

  private dir: 'left' | 'right' | 'top' | 'bottom' | 'tl' | 'tr' | 'bl' | 'br' | '' = '';
  private resizing = false;
  private dragging = false;

  private readonly minW = 320;
  private readonly minH = 220;

  @Output() close = new EventEmitter<void>();

  private readonly onResizeMoveBound = (e: MouseEvent) => this.onResizeMove(e);
  private readonly onDragMoveBound = (e: MouseEvent) => this.onDragMove(e);
  private readonly onUpBound = () => this.onUp();

  ngAfterViewInit(): void {
    const el = this.win.nativeElement;

    // ✅ IMPORTANT: set initial position in px so resize doesn't behave "centered"
    // (if your CSS uses left: 50% + transform, this neutralizes it)
    const rect = el.getBoundingClientRect();
    el.style.left = `${rect.left}px`;
    el.style.top = `${rect.top}px`;
    el.style.transform = 'none';

    // Bind resize handles
    const handles = el.querySelectorAll<HTMLElement>('.resize');

    handles.forEach((handle) => {
      handle.addEventListener('mousedown', (e: MouseEvent) => this.startResize(e));
    });
  }

  // Drag from top bar (your HTML uses (mousedown)="startDrag($event)")
  startDrag(e: MouseEvent): void {
    const el = this.win.nativeElement;

    this.dragging = true;
    this.resizing = false;
    this.dir = '';

    this.startX = e.clientX;
    this.startY = e.clientY;

    this.startLeft = el.offsetLeft;
    this.startTop = el.offsetTop;

    document.addEventListener('mousemove', this.onDragMoveBound);
    document.addEventListener('mouseup', this.onUpBound);

    e.preventDefault();
  }

  // Resize from any .resize span
  private startResize(e: MouseEvent): void {
    if (this.windowMaximized) {
      document.body.style.cursor = 'default';
      return;
    }

    const el = this.win.nativeElement;

    this.resizing = true;
    this.dragging = false;

    // ✅ MUST use currentTarget (the span you clicked), NOT target
    const handle = e.currentTarget as HTMLElement;

    // ✅ direction is whichever class is not "resize"
    const dir = Array.from(handle.classList).find((c) => c !== 'resize') ?? '';
    this.dir = dir as any;

    this.startX = e.clientX;
    this.startY = e.clientY;

    const cs = getComputedStyle(el);
    this.startW = parseFloat(cs.width) || el.offsetWidth;
    this.startH = parseFloat(cs.height) || el.offsetHeight;

    this.startLeft = el.offsetLeft;
    this.startTop = el.offsetTop;

    document.addEventListener('mousemove', this.onResizeMoveBound);
    document.addEventListener('mouseup', this.onUpBound);

    e.preventDefault();
  }

  private onDragMove(e: MouseEvent): void {
    if (this.windowMaximized) {
      document.body.style.cursor = 'default';
      return;
    }
    if (!this.dragging) return;

    const el = this.win.nativeElement;
    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;

    el.style.left = `${this.startLeft + dx}px`;
    el.style.top = `${this.startTop + dy}px`;
  }

  private onResizeMove(e: MouseEvent): void {
    if (!this.resizing) return;

    const el = this.win.nativeElement;

    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;

    let newW = this.startW;
    let newH = this.startH;
    let newLeft = this.startLeft;
    let newTop = this.startTop;

    // width from right
    if (this.dir === 'right' || this.dir === 'tr' || this.dir === 'br') newW = this.startW + dx;
    // height from bottom
    if (this.dir === 'bottom' || this.dir === 'bl' || this.dir === 'br') newH = this.startH + dy;

    // width from left
    if (this.dir === 'left' || this.dir === 'tl' || this.dir === 'bl') {
      newW = this.startW - dx;
      newLeft = this.startLeft + dx;
    }

    // height from top
    if (this.dir === 'top' || this.dir === 'tl' || this.dir === 'tr') {
      newH = this.startH - dy;
      newTop = this.startTop + dy;
    }

    // clamp min size (and keep the correct edge anchored)
    if (newW < this.minW) {
      if (this.dir === 'left' || this.dir === 'tl' || this.dir === 'bl') {
        newLeft -= this.minW - newW;
      }
      newW = this.minW;
    }

    if (newH < this.minH) {
      if (this.dir === 'top' || this.dir === 'tl' || this.dir === 'tr') {
        newTop -= this.minH - newH;
      }
      newH = this.minH;
    }

    el.style.width = `${newW}px`;
    el.style.height = `${newH}px`;
    el.style.left = `${newLeft}px`;
    el.style.top = `${newTop}px`;
  }

  private onUp(): void {
    this.dragging = false;
    this.resizing = false;

    document.removeEventListener('mousemove', this.onResizeMoveBound);
    document.removeEventListener('mousemove', this.onDragMoveBound);
    document.removeEventListener('mouseup', this.onUpBound);
  }

  ngOnDestroy(): void {
    this.onUp();
  }

  minimize() {
    this.close.emit();
  }

  private prev = {
    left: '0px',
    top: '0px',
    width: '600px',
    height: '360px',
  };

  windowMaximized = false;

  maximizeWindow() {
    const el = this.win.nativeElement;

    // Always animate while switching states
    el.style.transition = 'width 0.25s ease, height 0.25s ease, left 0.25s ease, top 0.25s ease';

    if (!this.windowMaximized) {
      // Save state
      this.prev = {
        left: el.style.left || `${el.offsetLeft}px`,
        top: el.style.top || `${el.offsetTop}px`,
        width: el.style.width || `${el.offsetWidth}px`,
        height: el.style.height || `${el.offsetHeight}px`,
      };

      // Maximize
      el.style.left = '0px';
      el.style.top = '0px';
      el.style.width = '100%';
      el.style.height = '100%';

      this.windowMaximized = true;
    } else {
      // Restore
      el.style.left = this.prev.left;
      el.style.top = this.prev.top;
      el.style.width = this.prev.width;
      el.style.height = this.prev.height;

      this.windowMaximized = false;

      // Remove transition AFTER animation finishes
      setTimeout(() => {
        el.style.transition = '';
      }, 260);
    }
  }

  closeWindow() {
    this.close.emit();
  }
}
