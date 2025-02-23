import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-image-modal',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, CommonModule],
  templateUrl: './image-modal.component.html',
  styleUrl: './image-modal.component.scss'
})
export class ImageModalComponent {
  @ViewChild('dialogContainer', { static: true }) dialogContainer!: ElementRef;

  isZoomed = false;
  minWidth = 300;
  minHeight = 200;
  maxWidth = 800;
  maxHeight = 600;
  dialogWidth = 400;
  dialogHeight = 300;
  resizing = false;

  constructor(
    public dialogRef: MatDialogRef<ImageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { imageUrl: string }
  ) {}

  adjustSize(expand: boolean) {
    if (this.resizing) return;
    this.resizing = true;

    const sizeChange = expand ? 100 : -100;
    this.dialogWidth = Math.max(this.minWidth, Math.min(this.dialogWidth + sizeChange, this.maxWidth));
    this.dialogHeight = Math.max(this.minHeight, Math.min(this.dialogHeight + sizeChange, this.maxHeight));

    this.dialogRef.updateSize(`${this.dialogWidth}px`, `${this.dialogHeight}px`);

    setTimeout(() => {
      this.resizing = false;
    }, 300);
  }

  close(): void {
    this.dialogRef.close();
  }

  toggleZoom(): void {
    this.isZoomed = !this.isZoomed;
  }
}
