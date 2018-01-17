import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BeerService {

  constructor(private http: HttpClient, private oktaService: OktaAuthService) {
  }

  getAll(): Observable<any> {
    const headers: Headers = new Headers();
    if (this.oktaService.isAuthenticated()) {
      const accessToken = this.oktaService.signIn.tokenManager.get('accessToken');
      headers.append('Authorization', accessToken.tokenType + ' ' + accessToken.accessToken);
    }
    return this.http.get('http://localhost:8081/good-beers',
      {headers: new HttpHeaders().set()});
  }
}
