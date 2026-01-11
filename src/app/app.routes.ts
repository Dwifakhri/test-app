import { Routes } from '@angular/router';
import { ProfileComponent } from './pages/profile/profile.component';
import { TestComponent } from './pages/test/test.component';
import { WritingTaskComponent } from './pages/writing-task/writing-task.component';
import { ResultComponent } from './pages/result/result.component';

export const routes: Routes = [
  { path: '', component: ProfileComponent },
  { path: 'test', component: TestComponent },
  { path: 'writing-task', component: WritingTaskComponent },
  { path: 'result', component: ResultComponent },
];
