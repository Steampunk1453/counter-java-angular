import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Task} from '../../../../data/schema/task';
import {TaskService} from '../../../../data/service/task.service';
import {interval, of, Subscription} from 'rxjs';
import {catchError, startWith, switchMap} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnInit {
  counterForm!: FormGroup;
  id = new FormControl();
  error: string | undefined;
  taskResponse: Task = new Task();
  isNextActive: boolean | undefined;
  isExecuteActive: boolean | undefined;
  showSpinner: boolean | undefined;
  isSpinnerView: boolean | undefined;
  timeInterval!: Subscription;
  counter!: number;
  limit!: number;

  constructor(private formBuilder: FormBuilder,
              private taskService: TaskService,
              private router: Router) {

    this.buildForm();
  }

  ngOnInit(): void {
    this.isNextActive = true;
    this.isExecuteActive = false;
    this.isSpinnerView = false;
    this.showSpinner = false;
  }

  buildForm(): void {
    this.counterForm = this.formBuilder.group({
      from: ['', Validators.required],
      to: ['', Validators.required]
    });
  }

  nextStep(): void  {
    if (this.validateCounters()) {
      this.isNextActive = false;
      this.isExecuteActive = true;
    }
  }

  lastStep(): void  {
      this.isNextActive = false;
      this.isExecuteActive = true;
      this.isSpinnerView = false;
  }

  executeCounter(): void  {
    const counter = this.counterForm.value;
    this.counter = parseInt(counter.from, 10) - 1;
    this.limit = counter.to;
    this.taskService.executeCounting(counter.from, counter.to)
      .pipe(catchError((error: any) => of( error)))
      .subscribe(() => {
        this.isFinishCounter();
      });
    this.isNextActive = true;
    this.isExecuteActive = false;
    this.isSpinnerView = true;
    this.showSpinner = true;
  }

  isFinishCounter(): void  {
    this.isNextActive = false;
    this.timeInterval = interval(1000)
      .pipe(
        startWith(0),
        switchMap(() => this.taskService.isFinishCounting())
      ).subscribe((data) => {
        if (data) {
          this.counter += 1;
        } else {
          this.counter = 0;
          this.showSpinner = false;
          this.isSpinnerView = false;
          this.isNextActive = true;
          this.timeInterval.unsubscribe();
        }
      });
  }

  cancelCounter(): void  {
    this.taskService.stopCounting()
      .pipe(catchError((error: any) => of( error)))
      .subscribe(() => {
        this.showSpinner = false;
        this.isNextActive = true;
        this.isExecuteActive = false;
      });
  }

  cancel(): void  {
    const url = '/tasks/list';
    this.router.navigate([url]);
  }

  private validateCounters(): void | boolean  {
    if (this.counterForm.invalid) {
      return Object.values(this.counterForm.controls)
        .forEach(control => {
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
