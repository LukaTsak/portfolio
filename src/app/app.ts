import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Taskbar } from "./taskbar/taskbar";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Taskbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('portfolio');
}
