import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OktaAuthService } from './shared/okta/okta.service';
import { Observable } from 'rxjs/Observable';

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
    if (this.oktaService.isAuthenticated()) {
      this.user = this.oktaService.idTokenAsUser;
    } else {
      this.oktaService.login();
    }

    // register a listener for authentication
    this.oktaService.user$.subscribe(user => {
      this.user = user;
      if (!user) {
        this.oktaService.login();
      }
      // Let angular know that model changed.
      this.changeDetectorRef.detectChanges();
    });
  }
}
