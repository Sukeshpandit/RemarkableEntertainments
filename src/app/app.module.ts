import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeroComponent } from './shared/components/hero/hero.component';
import { ExperiencesCardsComponent } from './shared/components/experiences-cards/experiences.component';
import { ShowcaseGridComponent } from './shared/components/showcase-grid/showcase-grid.component';
import { ClientLogosComponent } from './shared/components/client-logos/client-logos.component';
// import { EntertainmentsComponent } from './shared/components/entertainments/entertainments.component';
import { AboutComponent } from './shared/components/about/about.component';
import { NavigationComponent } from './shared/components/navigation/navigation.component';

//pages
import { HomeComponent } from './pages/home/home.component';
import { CelebrationsComponent } from './pages/celebrations/celebrations.component';
import { EntertainmentsComponent as EntertainmentsPageComponent } from './pages/entertainments/entertainments.component';
import { ExperiencesComponent as ExperiencesPageComponent } from './pages/experiences/experiences.component';
import { ExperienceMeasuresComponent } from './shared/components/experiences-components/experience-measures/experience-measures.component';
import { ExperienceWordsComponent } from './shared/components/experiences-components/experience-words/experience-words.component';
import { ExperienceNoteComponent } from './shared/components/experiences-components/experience-note/experience-note.component';
@NgModule({
  declarations: [
    AppComponent,
    HeroComponent,
    ExperiencesCardsComponent,
    ShowcaseGridComponent,
    ClientLogosComponent,
    // EntertainmentsComponent,
    AboutComponent,
    NavigationComponent,
    HomeComponent,
    CelebrationsComponent,
    EntertainmentsPageComponent,
    ExperiencesPageComponent,
    ExperienceMeasuresComponent,
    ExperienceWordsComponent,
    ExperienceNoteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
