import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-technician-category',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './technician-category.component.html',
  styleUrls: ['./technician-category.component.scss']
})
export class TechnicianCategoryComponent implements OnInit {
  technicianCategoryForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.technicianCategoryForm = this.fb.group({
      categoryName: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.technicianCategoryForm.valid) {
      console.log(this.technicianCategoryForm.value);
    }
  }
}
