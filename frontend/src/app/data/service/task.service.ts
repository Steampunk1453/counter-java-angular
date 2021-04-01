import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {map} from 'rxjs/operators';
import {Task} from '../schema/task';
import {ApiService} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private TASK_URL = '/tasks/';

  constructor(private apiService: ApiService) {}

  create(task: Task): Observable<Task> {
    return this.apiService.post(this.TASK_URL, task)
      .pipe(
        map((data) => {
            return data;
          }
        )
      );
  }

  getAll(): Observable<Array<Task>> {
    return this.apiService.get(this.TASK_URL)
      .pipe(
        map((data) => {
            return data;
          }
        )
      );
  }

  getById(id: number | string): Observable<Task> {
    return this.apiService.get(`${this.TASK_URL}/${id}`)
      .pipe(
        map((data) => {
            return data;
          }
        )
      );
  }


  update(task: Task, id: number | string): Observable<Task> {
    return this.apiService.put(`${this.TASK_URL}${id}`, task)
      .pipe(
        map((data) => {
            return data;
          }
        )
      );
  }

  delete(id: string | undefined): Observable<{}> {
    return this.apiService.delete(`${this.TASK_URL}${id}`)
      .pipe(
        map((data) => {
            return data;
          }
        )
      );
  }

  executeTask(id: number | string): Observable<{}> {
    return this.apiService.post(`${this.TASK_URL}${id}/execute`)
      .pipe(
        map((data) => {
            return data;
          }
        )
      );
  }

  executeCounting(start: number, end: number): Observable<{}> {
    return this.apiService.get(`${this.TASK_URL}counter/${start}/${end}`)
      .pipe(
        map((data) => {
            return data;
          }
        )
      );
  }

  stopCounting(): Observable<{}> {
    return this.apiService.get(`${this.TASK_URL}counter/stop`)
      .pipe(
        map((data) => {
            return data;
          }
        )
      );
  }

  isFinishCounting(): Observable<boolean> {
    return this.apiService.get(`${this.TASK_URL}counter/isFinish`)
      .pipe(
        map((data) => {
            return data;
          }
        )
      );
  }

}
