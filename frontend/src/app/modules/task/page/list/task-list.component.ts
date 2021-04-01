import {Component, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSnackBar} from '@angular/material/snack-bar';
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs';
import {Router} from '@angular/router';
import {Task} from 'src/app/data/schema/task';
import {TaskService} from '../../../../data/service/task.service';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent {
  tasks: Task[] = [];
  displayedColumns = ['name', 'description' , 'operations'];
  dataSource: MatTableDataSource<Task> = new MatTableDataSource<Task>();
  loading = true;
  error: string | undefined;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(private taskService: TaskService,
              private snackBar: MatSnackBar,
              private router: Router) {

    this.taskService.getAll().pipe(
      catchError(error => of(this.error = error)))
      .subscribe((data) => {
        if (data) {
          this.tasks = data;
          this.dataSource = new MatTableDataSource(this.tasks);
          this.dataSource.paginator = this.paginator;
          this.loading = false;
        }
      });
  }

  navigateToDetail(): void {
    const url = '/tasks/detail';
    this.router.navigate([url]);
  }

  navigateToCounter(task: Task): void {
    this.snackBar.open(`Counter task #${task.name}`, 'Create', {
      duration: 2000
    });
    const url = '/tasks/counter';
    this.router.navigate([url]);
  }

  editTask(task: Task): void {
    this.snackBar.open(`Edit task #${task.name}`, 'Edit', {
      duration: 2000
    });
    const url = '/tasks/detail/';
    this.router.navigate([url + task.id]);
  }

  deleteTask(task: Task): void {
    this.snackBar.open(`Deleting task #${task.name}`, 'Delete', {
      duration: 2000
    });
    this.taskService.delete(task.id).pipe(
      catchError(error => of(this.error = error)))
      .subscribe();
    this.dataSource.data.splice(this.dataSource.data.indexOf(task), 1);
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
