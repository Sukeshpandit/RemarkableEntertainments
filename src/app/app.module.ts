import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeroComponent } from './shared/components/hero/hero.component';
import { ExperiencesComponent } from './shared/components/experiences-cards/experiences.component';
import { ShowcaseGridComponent } from './shared/components/showcase-grid/showcase-grid.component';
@NgModule({
  declarations: [
    AppComponent,
    HeroComponent,
    ExperiencesComponent,
    ShowcaseGridComponent
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
