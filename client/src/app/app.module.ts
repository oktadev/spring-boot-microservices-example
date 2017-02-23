import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { StormpathModule, StormpathConfiguration } from 'angular-stormpath';

import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { BeerListComponent } from './beer-list/beer-list.component';
import { BeerService } from './shared/beer.service';
import { GiphyService } from './shared/giphy.service';
import { environment } from '../environments/environment';
import { MaterialModule } from '@angular/material';
import { AppShellModule } from '@angular/app-shell';

export const appRoutes: Routes = [
  {
    path: 'beers',
    component: BeerListComponent
  }
];

export function stormpathConfig() {
  let spConfig: StormpathConfiguration = new StormpathConfiguration();
  if (environment.production) {
    spConfig.endpointPrefix = 'https://pwa-edge-service.cfapps.io';
  } else {
    spConfig.endpointPrefix = 'http://localhost:8081';
  }
  spConfig.autoAuthorizedUris.push(new RegExp(spConfig.endpointPrefix + '/*'));
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
    MaterialModule,
    AppShellModule.runtime(),
    StormpathModule
  ],
  providers: [BeerService, GiphyService,
    {
      provide: StormpathConfiguration, useFactory: stormpathConfig
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
