import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

import { TaskService } from '../task.service';
import { AlertService } from '../../alert.service';

@Component({
  selector: 'app-new-tasks',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './new-tasks.component.html',
  styleUrl: './new-tasks.component.css'
})
export class NewTasksComponent {
  createTaskForm!: FormGroup;

  constructor(
    private taskService: TaskService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.createTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      start: [this.getCurrentDateTime(), Validators.required],
      end: [this.getCurrentDateTime(), Validators.required],
      user_ids: [''],
    });
  }

  onSubmit(): void {
    // Convert dates to ISO string format before sending to backend
    const formData = { ...this.createTaskForm.value };
  
    // Format start and end dates as YYYY-MM-DD HH:MM:SS
    formData.start = this.formatDateTime(formData.start);
    formData.end = this.formatDateTime(formData.end);
  
    // Parse collabs string into an array
    const collabs: string[] = formData.user_ids.split(',').map((collab: string) => collab.trim());
  
    // Array to hold the observables for checking user existence
    const observables = collabs.map(collab => this.taskService.checkUserExists(collab));
  
    forkJoin(observables).subscribe(
      (userIds: (string | null)[]) => {
        const existingCollabs: string[] = [];
  
        for (let i = 0; i < userIds.length; i++) {
          const userId = userIds[i];
          if (userId !== null) {
            existingCollabs.push(userId);
          } else {
            console.log(`User ${collabs[i]} does not exist.`);
            Swal.fire({
              icon: 'error',
              title: 'User Not Found',
              text: `User ${collabs[i]} does not exist.`,
              confirmButtonText: 'OK',
            });
          }
        }
  
        // After all checks are done, update the collabs field with the user IDs of existing collaborators
        formData.user_ids = existingCollabs;

        // Call the task service to create a new task
        this.taskService.createTask(formData).subscribe(
          (response) => {
            console.log('Form data:', formData)
            console.log(response);
            // Optionally, reset the form after successful submission
            this.createTaskForm.reset();
          },
          (error) => {
            console.error('Error creating task:', error);
          }
        );
      },
      (error) => {
        console.error('Error checking user existence:', error);
        // Handle the error
      }
    );
  }


  getCurrentDateTime(): string {
    const now = new Date();
    return now.toISOString();
  }

  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    const formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');
    return formattedDate;
  }
}  
