import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Taskbar } from "../taskbar/taskbar";

@Component({
  selector: 'app-desktop',
  imports: [CdkDrag, Taskbar, CdkDragHandle],
  templateUrl: './desktop.html',
  styleUrl: './desktop.scss',
})
export class Desktop {

}
