import {RouterModule, Routes} from '@angular/router';
import {TaskListComponent} from './page/list/task-list.component';
import {CounterComponent} from './page/counter/counter.component';
import {TaskComponent} from './page/detail/task.component';

const routes: Routes = [
  {
    path: 'list',
    component: TaskListComponent
  },
  {
    path: 'detail',
    component: TaskComponent
  },
  {
    path: 'detail/:id',
    component: TaskComponent
  },
  {
    path: 'counter',
    component: CounterComponent
  },
];
export const TaskRoutes = RouterModule.forChild(routes);
