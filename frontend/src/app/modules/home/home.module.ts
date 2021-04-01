import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './page/home.component';
import {HomeRoutingModule} from './home-routing.module';
import {TaskModule} from '../task/task.module';


@NgModule({
  declarations: [HomeComponent],
    imports: [
        CommonModule,
        HomeRoutingModule,
        TaskModule
    ]
})
export class HomeModule { }
