import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-subject-generation-dialog',
  templateUrl: './subject-generation-dialog.component.html',
  styleUrls: ['./subject-generation-dialog.component.css']
})
export class SubjectGenerationDialogComponent {
  isLoading = true;

  constructor(
    public dialogRef: MatDialogRef<SubjectGenerationDialogComponent>
  ) {}

  completeGeneration() {
    this.isLoading = false;
    setTimeout(() => {
      this.dialogRef.close(true); // Close dialog with a "true" result
    }, 1000);
  }
}
