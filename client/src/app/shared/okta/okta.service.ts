import { Injectable } from '@angular/core';
import * as OktaSignIn from '@okta/okta-signin-widget/dist/js/okta-sign-in.min.js'
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class OktaAuthService {

  signIn = new OktaSignIn({
    baseUrl: 'https://dev-158606.oktapreview.com',
    clientId: 'MjlYvTtFW26gOoOAHKOz',
    authParams: {
      issuer: 'https://dev-158606.oktapreview.com',
      responseType: ['id_token', 'token'],
      scopes: ['openid', 'email', 'profile']
    }
  });

  public user$: Observable<any>;
  public userSource: ReplaySubject<any>;

  constructor() {
    this.userSource = new ReplaySubject<any>(1);
    this.user$ = this.userSource.asObservable();
  }

  isAuthenticated() {
    // Checks if there is a current accessToken in the TokenManger.
    return !!this.signIn.tokenManager.get('accessToken');
  }

  login() {
    // Launches the widget and stores the tokens.
    this.signIn.renderEl({el: '#okta-signin-container'}, response => {
      if (response.status === 'SUCCESS') {
        response.forEach(token => {
          if (token.idToken) {
            this.signIn.tokenManager.add('idToken', token);
          }
          if (token.accessToken) {
            this.signIn.tokenManager.add('accessToken', token);
          }
          this.userSource.next(this.idTokenAsUser);
          this.signIn.hide();
        });
      } else {
        console.error(response);
      }
    });
  }

  get idTokenAsUser() {
    const token = this.signIn.tokenManager.get('idToken');
    return {
      name: token.claims.name,
      email: token.claims.email,
      username: token.claims.preferred_username
    }
  }

  async logout() {
    // Terminates the session with Okta and removes current tokens.
    this.signIn.tokenManager.clear();
    await this.signIn.signOut();
    this.signIn.remove();
    this.userSource.next(undefined);
  }
}
