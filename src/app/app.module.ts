import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeroComponent } from './shared/components/hero/hero.component';
import { ExperiencesComponent } from './shared/components/experiences-cards/experiences.component';
import { ShowcaseGridComponent } from './shared/components/showcase-grid/showcase-grid.component';
import { ClientLogosComponent } from './shared/components/client-logos/client-logos.component';
import { EntertainmentsComponent } from './shared/components/entertainments/entertainments.component';
import { AboutComponent } from './shared/components/about/about.component';
@NgModule({
  declarations: [
    AppComponent,
    HeroComponent,
    ExperiencesComponent,
    ShowcaseGridComponent,
    ClientLogosComponent,
    EntertainmentsComponent,
    AboutComponent,
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
