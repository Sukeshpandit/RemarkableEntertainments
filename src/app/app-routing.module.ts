import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CelebrationsComponent } from './pages/celebrations/celebrations.component';
import { EntertainmentsComponent } from './pages/entertainments/entertainments.component';
import { ExperiencesComponent } from './pages/experiences/experiences.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'celebrations', component: CelebrationsComponent },
  { path: 'entertainments', component: EntertainmentsComponent },
  { path: 'experiences', component: ExperiencesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
