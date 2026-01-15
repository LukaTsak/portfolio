import { CdkDrag } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Taskbar } from '../taskbar/taskbar';
import { Window } from '../window/window';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-desktop',
  imports: [CdkDrag, Taskbar, Window, CommonModule, FormsModule],
  templateUrl: './desktop.html',
  styleUrl: './desktop.scss',
})
export class Desktop {
  isPdfIconActive = false;
  isAboutIconActive = false;

  pdfClickCount = 0;
  aboutClickCount = 0;

  isPdfOpen = false;
  isAboutOpen = false;

  activateIcon(icon: string) {
    (this.isPdfIconActive = icon === 'pdf' ? true : false),
      (this.isAboutIconActive = icon === 'about' ? true : false);

    if (icon === 'pdf') {
      this.pdfClickCount += 1;
    }
    if (icon === 'about') {
      this.aboutClickCount += 1;
    }

    if (this.pdfClickCount >= 2) {
      this.openWindow('pdf');
    }

    if (this.aboutClickCount >= 2) {
      this.openWindow('about');
    }

    setTimeout(() => {
      this.pdfClickCount = 0;
      this.aboutClickCount = 0;
    }, 500);
  }

  openWindow(app: string) {
    if (app === 'pdf') this.isPdfOpen = true;
    if (app === 'about') this.isAboutOpen = true;
  }
}
