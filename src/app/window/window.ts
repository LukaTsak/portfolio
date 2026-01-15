import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-window',
  imports: [],
  templateUrl: './window.html',
  styleUrl: './window.scss',
})
export class Window implements AfterViewInit, OnDestroy {
  spawnX = 50 + (Math.floor(Math.random() * 12 - 6));
  spawnY = 50 + (Math.floor(Math.random() * 10 - 5));

  @ViewChild('win', { static: true }) win!: ElementRef<HTMLElement>;

  private startX = 0;
  private startY = 0;

  private startW = 0;
  private startH = 0;

  private startLeft = 0;
  private startTop = 0;

  private dir = '';
  private dragging = false;

  private readonly minW = 320;
  private readonly minH = 220;

  private onResizeMoveBound = (e: MouseEvent) => this.onResizeMove(e);
  private onDragMoveBound = (e: MouseEvent) => this.onDragMove(e);
  private onUpBound = () => this.onUp();

  ngAfterViewInit(): void {
    const el = this.win.nativeElement;
    const handles = el.querySelectorAll<HTMLElement>('.resize');

    handles.forEach((handle) => {
      handle.addEventListener('mousedown', (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        this.dir = target.classList[1];
        this.dragging = false;

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
      });
    });
  }

  startDrag(e: MouseEvent): void {
    const el = this.win.nativeElement;

    this.dragging = true;
    this.dir = '';

    this.startX = e.clientX;
    this.startY = e.clientY;

    this.startLeft = el.offsetLeft;
    this.startTop = el.offsetTop;

    document.addEventListener('mousemove', this.onDragMoveBound);
    document.addEventListener('mouseup', this.onUpBound);

    e.preventDefault();
  }

  private onDragMove(e: MouseEvent): void {
    if (!this.dragging) return;

    const el = this.win.nativeElement;

    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;

    el.style.left = `${this.startLeft + dx}px`;
    el.style.top = `${this.startTop + dy}px`;
  }

  private onResizeMove(e: MouseEvent): void {
    const el = this.win.nativeElement;

    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;

    let newW = this.startW;
    let newH = this.startH;
    let newLeft = this.startLeft;
    let newTop = this.startTop;

    if (this.dir === 'right' || this.dir === 'tr' || this.dir === 'br') newW = this.startW + dx;
    if (this.dir === 'bottom' || this.dir === 'bl' || this.dir === 'br') newH = this.startH + dy;

    if (this.dir === 'left' || this.dir === 'tl' || this.dir === 'bl') {
      newW = this.startW - dx;
      newLeft = this.startLeft + dx;
    }

    if (this.dir === 'top' || this.dir === 'tl' || this.dir === 'tr') {
      newH = this.startH - dy;
      newTop = this.startTop + dy;
    }

    if (newW < this.minW) {
      if (this.dir === 'left' || this.dir === 'tl' || this.dir === 'bl')
        newLeft -= this.minW - newW;
      newW = this.minW;
    }

    if (newH < this.minH) {
      if (this.dir === 'top' || this.dir === 'tl' || this.dir === 'tr') newTop -= this.minH - newH;
      newH = this.minH;
    }

    el.style.width = `${newW}px`;
    el.style.height = `${newH}px`;
    el.style.left = `${newLeft}px`;
    el.style.top = `${newTop}px`;
  }

  private onUp(): void {
    this.dragging = false;
    document.removeEventListener('mousemove', this.onResizeMoveBound);
    document.removeEventListener('mousemove', this.onDragMoveBound);
    document.removeEventListener('mouseup', this.onUpBound);
  }

  ngOnDestroy(): void {
    this.onUp();
  }
}
