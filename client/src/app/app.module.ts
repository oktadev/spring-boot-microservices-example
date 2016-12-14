import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { StormpathModule, StormpathConfiguration } from 'angular-stormpath';

import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { BeerListComponent } from './beer-list/beer-list.component';
import { BeerService } from './shared/beer.service';
import { GiffyService } from './shared/giffy.service';

export const appRoutes: Routes = [
  {
    path: 'beers',
    component: BeerListComponent
  }
];

export function stormpathConfig() {
  let spConfig: StormpathConfiguration = new StormpathConfiguration();
  spConfig.endpointPrefix = 'http://localhost:8081';
  return spConfig;
}

@NgModule({
  declarations: [
    AppComponent,
    BeerListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    StormpathModule
  ],
  providers: [BeerService, GiffyService,
    {
      provide: StormpathConfiguration, useFactory: stormpathConfig
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
