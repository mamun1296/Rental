import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-action',
  standalone: true,
  imports: [CommonModule,MatTooltip],
  templateUrl: './action.component.html',
  styleUrl: './action.component.scss'
})
export class ActionComponent {

  // @Input() actions: { label: string, icon: string, color: string, title: string, isActive?: boolean, isDisabled?: boolean }[] = [];
  // @Output() actionClick = new EventEmitter<{ title: string }>();

  // onActionClick(label: any) {
  //   console.log('label',label);
  //   this.actionClick.emit(label);
  // }


  @Input() actions: { buttonName: string, icon: string, cssClass: string, tooltip: string, isActive?: boolean, isDisabled?: boolean }[] = [];
  @Output() actionClick = new EventEmitter<{ action: string }>();

  onActionClick(action: any, isDisabled?: boolean ) {
    // Check if the action is disabled
    if (isDisabled) {
      // If disabled, do nothing
      return;
    }
    // Otherwise, emit the action click event
    //console.log('Action clicked:',action);
    this.actionClick.emit(action);
  }  
}
