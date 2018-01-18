import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BeerListComponent } from './beer-list/beer-list.component';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule, MatListModule, MatToolbarModule, } from '@angular/material';
import { OktaService } from './shared/okta/okta.service';

@NgModule({
  declarations: [
    AppComponent,
    BeerListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatListModule, MatButtonModule, MatToolbarModule
  ],
  providers: [OktaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
