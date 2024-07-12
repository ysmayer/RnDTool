// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DbScriptCreatorComponent } from './db-script-creator/db-script-creator.component';
import { BuildFailureExplainerComponent } from './build-failure-explainer/build-failure-explainer.component';
import { LogErrorExplainerComponent } from './log-error-explainer/log-error-explainer.component';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './home/home.component'; // You'll need to create this

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: '', 
    component: HomeComponent, 
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'db-script', pathMatch: 'full' },
      { path: 'db-script', component: DbScriptCreatorComponent },
      { path: 'build-failure', component: BuildFailureExplainerComponent },
      { path: 'log-error', component: LogErrorExplainerComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }