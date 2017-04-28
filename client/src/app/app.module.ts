import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { BeerListComponent } from './beer-list/beer-list.component';
import { BeerService } from './shared/beer/beer.service';
import { GiphyService } from './shared/giphy/giphy.service';
import { MaterialModule } from '@angular/material';
import { AppShellModule } from '@angular/app-shell';
import { StormpathConfiguration, StormpathModule } from 'angular-stormpath';

export function stormpathConfig(): StormpathConfiguration {
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
    MaterialModule,
    AppShellModule.runtime()
  ],
  providers: [
	{ provide: StormpathConfiguration, useFactory: stormpathConfig },
  	BeerService, GiphyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
