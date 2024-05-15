import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, finalize, map } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

import { forkJoin } from 'rxjs';

import { TaskModel } from '../../collabHub';
import { TaskService } from '../task.service';
import { AuthService } from '../../Auth/auth.service';
import { AlertService } from '../../alert.service';
import { DateTimeUtilsService } from '../../date-time-utils.service';
import { TaskUserUtilsService } from '../task-user-utils.service';

/**
 * Component directive for creating new tasks.
 */
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
  task: TaskModel | null = null;
  createTaskForm!: FormGroup;
  selectedTaskId: string | null = null;

    /**
   * Constructs the NewTasksComponent.
   * @param taskService - The task service.
   * @param fb - The form builder service.
   * @param alertService - The alert service.
   * @param dateTimeUtils - The date time utility service.
   */
  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private fb: FormBuilder,
    private alertService: AlertService,
    private dateTimeUtils: DateTimeUtilsService,
    private router: Router,
    private route: ActivatedRoute,
    private taskUserUtilsService: TaskUserUtilsService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    // Check route parameters for task ID
    this.route.params.subscribe(params => {
      const taskId = params['id'];
      if (taskId) {
        this.selectedTaskId = taskId; // Set selectedTaskId from route params
        this.taskService.getTask(taskId).subscribe(task => {
          this.task = task;
          this.populateForm(task);
        });
      }
    });

    // Check TaskDetailsService for selected task ID
    this.taskUserUtilsService.selectedTaskId$.subscribe(taskId => {
      if (!this.selectedTaskId && taskId) {
        this.selectedTaskId = taskId; // Set selectedTaskId from TaskDetailsService if not already set
        this.taskService.getTask(taskId).subscribe(task => {
          this.task = task;
          this.populateForm(task);
        });
      }
    });
  }

  initForm(): void {
    this.createTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      start: [this.dateTimeUtils.getCurrentDateTime(), Validators.required],
      end: [this.dateTimeUtils.getCurrentDateTime(), Validators.required],
      user_ids: [''],
    });
  }
  
  populateForm(task: TaskModel | null): void {
    if (task) {
      this.createTaskForm.patchValue({
        title: task.title,
        description: task.description,
        start: task.start ? this.dateTimeUtils.formatDateTime(task.start.toISOString()) : '',
        end: task.end ? this.dateTimeUtils.formatDateTime(task.end.toISOString()) : '',
        user_ids: task.user_ids ? task.user_ids.join(', ') : '',
      });
    }
  }

  /** Handles form submission to create a new task. */
  onSubmit(): void {
    // Convert dates to ISO string format before sending to backend
    const formData = { ...this.createTaskForm.value };
  
    // Format start and end dates as YYYY-MM-DD HH:MM:SS
    formData.start = this.dateTimeUtils.formatDateTime(formData.start);
    formData.end = this.dateTimeUtils.formatDateTime(formData.end);
    const collabs: string[] = formData.user_ids.split(',')
    .map((id: string) => id.trim())
    .filter((id: string) => id);
  
    if (collabs.length === 0) {
      console.error('No collaborators found');
      this.saveTask(formData); // Save task directly if no collabs
    } else {
      const observables = collabs.map((collab: string) => 
        this.authService.checkUserExists(collab).pipe(
          map(userId => ({ userId, collab })),
          catchError(error => {
            console.error('Error checking user existence:', error);
            return of({ userId: null, collab }); // Continue with null userId
          })
        )
      );
  
      forkJoin(observables).subscribe(results => {
        // console.log('User IDs:', results.map(result => result.userId));
        const existingCollabs: string[] = [];
        const nonExistingCollabs: string[] = [];

        results.forEach(result => {
          if (result.userId !== null) {
            existingCollabs.push(result.userId);
          } else {
            nonExistingCollabs.push(result.collab);
          }
        });
  
        if (nonExistingCollabs.length > 0) {
          console.error('Users Not Found:', nonExistingCollabs);
          this.alertService.showAlert(
            `Users Not Found: ${nonExistingCollabs.join(', ')}`,
            'error',
            'User Not Found'
          );
        } else {
          // Update formData user_ids with existing collabs
          console.log('Existing Collabs:', existingCollabs);
          formData.user_ids = existingCollabs;
          // Save the task
          this.saveTask(formData);
        }
      }, error => {
        console.error('Error checking user existence:', error);
        this.alertService.showAlert('Error checking user existence', 'error', 'Error');
      });
    }
  }
  
  // Method to save task (create or update)
  private saveTask(formData: any): void {
    if (this.task) {
      const updatedTask = {
        ...this.task,
        ...formData,
        user_ids: formData.user_ids // Ensure this has valid user ids
      } as TaskModel;
  
      this.taskService.updateTask(updatedTask).subscribe(
        response => {
          this.alertService.showAlert('Task updated successfully', 'success', 'Success');
          this.router.navigate(['/tasks', this.task!.id]);
        },
        error => {
          console.error('Error updating task:', error);
          this.alertService.showAlert('Error updating task', 'error', 'Error');
        }
      );
    } else {
      this.taskService.createTask(formData).subscribe(
        response => {
          this.alertService.showAlert('Task created successfully', 'success', 'Success');
          this.createTaskForm.reset();
          this.router.navigate(['/tasks']);
        },
        error => {
          console.error('Error creating task:', error);
          this.alertService.showAlert('Error creating task', 'error', 'Error');
        }
      );
    }
  }
  
  
  
}  
