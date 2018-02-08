import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OktaService } from './shared/okta/okta.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  user;
  signIn;

  constructor(private oktaService: OktaService, private changeDetectorRef: ChangeDetectorRef) {
    this.signIn = oktaService.getWidget();
  }

  showLogin() {
    this.signIn.renderEl({el: '#okta-signin-container'}, (response) => {
      if (response.status === 'SUCCESS') {
        response.forEach(token => {
          if (token.idToken) {
            this.signIn.tokenManager.add('idToken', token);
            this.user = this.getUser(token);
          }
          if (token.accessToken) {
            this.signIn.tokenManager.add('accessToken', token);
          }
        });
        this.signIn.remove();
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  getUser(token) {
    return {
      name: token.claims.name,
      email: token.claims.email,
      username: token.claims.preferred_username
    };
  }

  ngOnInit() {
    this.signIn.session.get((response) => {
      if (response.status !== 'INACTIVE') {
        const token = this.oktaService.getIdToken();
        this.user = this.getUser(token);
        this.changeDetectorRef.detectChanges();
      } else {
        this.showLogin();
      }
    });
  }

  logout() {
    this.signIn.signOut(() => {
      this.user = undefined;
      this.changeDetectorRef.detectChanges();
      this.showLogin();
    });
  }
}
