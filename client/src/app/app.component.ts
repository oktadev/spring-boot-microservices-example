import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OktaAuthService } from './shared/okta/okta.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'app works!';
  user;

  constructor(public oktaService: OktaAuthService, private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    // for initial load and browser refresh
    if (this.oktaService.isAuthenticated()) {
      this.user = this.oktaService.idTokenAsUser;
    } else {
      this.oktaService.login();
    }

    // register a listener for authentication and logout
    this.oktaService.user$.subscribe(user => {
      this.user = user;
      if (!user) {
        this.oktaService.login();
      }
      // Let Angular know that model changed.
      // See https://github.com/okta/okta-signin-widget/issues/268 for more info.
      this.changeDetectorRef.detectChanges();
    });
  }
}
