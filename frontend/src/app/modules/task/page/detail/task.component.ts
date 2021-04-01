import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Task} from '../../../../data/schema/task';
import {TaskService} from '../../../../data/service/task.service';
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  taskForm!: FormGroup;
  id = new FormControl();
  error: string | undefined;
  taskResponse: Task = new Task();
  isCreateActive: boolean | undefined;
  isUpdateActive: boolean | undefined;

  constructor(private formBuilder: FormBuilder,
              private taskService: TaskService,
              private route: ActivatedRoute,
              private router: Router) {

    this.buildForm();
  }

  ngOnInit(): void {
    let id = '';
    this.route.params.subscribe(params => {
      id = params.id;
    });
    this.getFormElements(id);
  }

  buildForm(): void {
    this.taskForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      description: [''],
    });
  }

  createTask(): void {
    if (this.validateTask()) {
      const task = this.taskForm.value;
      this.taskService.create(task).pipe(
        catchError(error => of(this.error = error)))
        .subscribe((data) => {
          if (data) {
            this.taskResponse = data;
            this.router.navigate(['tasks/list']);
          }
        });
    }
  }

  updateTask(): void {
    if (this.validateTask()) {
      const task = this.taskForm.value;
      this.taskService.update(task, task.id).pipe(
        catchError(error => of(this.error = error)))
        .subscribe((data) => {
          if (data) {
            this.taskResponse = data;
            this.router.navigate(['tasks/list']);
          }
        });
    }
  }

  cancel(): void {
    const url = '/tasks/list';
    this.router.navigate([url]);
  }

  private getFormElements(id: string): void {
    if (id) {
      this.loadTask(id);
      this.isUpdateActive = true;
      this.isCreateActive = false;
    } else {
      this.isCreateActive = true;
      this.isUpdateActive = false;
    }
  }

  private loadTask(id: string): void {
    this.taskService.getById(id).pipe(
      catchError(error => of(this.error = error)))
      .subscribe((data) => {
        if (data) {
          this.taskForm.setValue({
            id: data.id,
            name: data.name,
            description: data.description
          });
        }
      });
  }

  private validateTask(): void | boolean {
    if (this.taskForm.invalid) {
      return Object.values(this.taskForm.controls).forEach(control => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(cont => cont.markAsTouched());
        } else {
          control.markAsTouched();
        }
        return false;
      });
    }
    return true;
  }

}
