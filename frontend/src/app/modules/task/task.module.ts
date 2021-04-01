import {NgModule} from '@angular/core';
import {CounterComponent} from './page/counter/counter.component';
import {TaskRoutes} from './task-routing.module';
import {TaskListComponent} from './page/list/task-list.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../shared/material.module';
import {CommonModule} from '@angular/common';
import {TaskComponent} from './page/detail/task.component';


@NgModule({
    declarations: [CounterComponent, TaskListComponent, TaskComponent],
  exports: [
    TaskListComponent,
    CounterComponent,
    TaskComponent
  ],
  imports: [
    TaskRoutes,
    ReactiveFormsModule,
    MaterialModule,
    CommonModule,
  ]
})
export class TaskModule { }
