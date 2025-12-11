import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeroComponent } from './shared/components/hero/hero.component';
import { ShowcaseCardComponent } from './shared/components/showcase-card/showcase-card.component';
@NgModule({
  declarations: [
    AppComponent,
    HeroComponent,
    ShowcaseCardComponent
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
