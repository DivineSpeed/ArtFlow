import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';
import { roleGuard } from '../guards/role.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MyspaceComponent } from './components/myspace/myspace.component';

const routes: Routes = [
  {
    path:"myspace" , component:MyspaceComponent , canActivate: [authGuard],
  },
  {
    path:"dashboard" , component:DashboardComponent, canActivate: [authGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArtisanRoutingModule { }
