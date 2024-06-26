import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { TaskModel, TaskAttachment } from '../../collabHub';
import { TaskService } from '../task.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TaskUserUtilsService } from '../task-user-utils.service';
import { AuthService } from '../../Auth/auth.service';

/**
 * Component directive for tasks attachments.
 */
@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {
  taskForm!: FormGroup;
  task: TaskModel | null = null; // Initialize task as null
  attachments: TaskAttachment[] = []; // Initialize attachments as empty array
  currentAttachment: TaskAttachment | null = null; // Track the attachment being edited
  isEditMode: boolean = false; // Flag to track if we are in edit mode
  creatorUsername: string = ''; // Initialize creator username as empty string

  constructor(
    private taskService: TaskService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private taskUserUtilsService: TaskUserUtilsService,
    private authService: AuthService,
    // private changeDetector: ChangeDetectorRef,
   ) { }

  initForm(): void {
    this.taskForm = this.fb.group({
      info: ['', Validators.required],
      file: [null], // For file upload
      link: [''],
      tag: ['']
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.route.paramMap.subscribe(params => {
      const taskId = params.get('taskId');
      if (taskId) {
        this.getTaskData(taskId);
      }
    });
  }

  getTaskData(taskId: string): void {
    this.taskService.getTask(taskId).subscribe((task: TaskModel | null) => {
      if (task) {
        this.task = task;
        this.populateForm();
        this.displayCreator(task.created_by); // Display creator username
        // Fetch attachments after the task data is retrieved
        this.taskService.getTaskAttachments(taskId).subscribe((attachments: TaskAttachment[]) => {
          this.attachments = attachments;
        });
      }
    });
  }

  editTask(task: TaskModel): void {
    this.taskUserUtilsService.setSelectedTaskId(task.id);
    this.router.navigate(['/tasks/new']);
  }

  populateForm(): void {
    if (this.task) {
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description,
        status: this.task.status,
        created_by: this.task.created_by
      });
    }
  }

  editAttachment(attachment: TaskAttachment): void {
    this.currentAttachment = attachment;
    this.isEditMode = true;
    this.taskForm.patchValue({
      info: attachment.info,
      file: attachment.file,
      link: attachment.link,
      tag: attachment.tag
    });
    document.getElementById('card-container')?.scrollIntoView({ behavior: 'smooth' });
  }

  onSubmit(): void {
    if (!this.task || this.taskForm.invalid) {
      console.error('No task available.');
      return;
    }

    const taskId = this.task.id;
    const attachmentData = this.taskForm.value;

    if (this.isEditMode && this.currentAttachment) {
      // Update existing attachment
      attachmentData.id = this.currentAttachment.id;
      this.taskService.updateAttachment(taskId, attachmentData).subscribe(
        (response: TaskAttachment) => {
          if (response) {
            const index = this.attachments.findIndex(att => att.id === this.currentAttachment!.id);
            this.attachments[index] = response;
            console.log(this.attachments[index])
            this.resetForm();
            // this.changeDetector.detectChanges();
          } else {
            console.error('No response received after updating attachment.');
          }
        },
        (error) => {
          console.error('Error updating attachment:', error);
        }
      );
    } else {
      // Save new attachment
      this.taskService.saveAttachment(taskId, attachmentData).subscribe(
        (response: TaskAttachment) => {
          if (response) {
            this.attachments.push(response);
            this.resetForm();
            // this.changeDetector.detectChanges();
          } else {
            console.error('No response received after saving attachment.');
          }
        },
        (error) => {
          console.error('Error saving attachment:', error);
        }
      );
    }
  }

  deleteAttachment(attachmentId: string): void {
    if (!this.task || !attachmentId) {
      console.error('No task available.');
      return;
    }
    console.log(attachmentId)

    const taskId = this.task.id;
    this.taskService.deleteAttachment(taskId, attachmentId).subscribe(
      () => {
        console.log(taskId, attachmentId)
        this.attachments = this.attachments.filter(att => att.id !== attachmentId);
      },
      (error) => console.error('Error deleting attachment:', error)
    );
  }

  displayCreator(userId: string): void {
    this.authService.getUsername(userId).subscribe(
      (username: string) => {
        console.log(username)
        this.creatorUsername = username;
      },
      (error) => console.error('Error getting user:', error)
    );
  }

  displayUsernames(task: TaskModel): string {
    const usernames = this.taskUserUtilsService.getUsernamesForTask(task.id);
    console.log(task)
    return this.taskUserUtilsService.displayUsernames(usernames);
  }

  resetForm(): void {
    this.taskForm.reset();
    this.currentAttachment = null;
    this.isEditMode = false;
  }
}
