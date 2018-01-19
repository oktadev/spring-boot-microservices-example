import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { OktaService } from '../okta/okta.service';

@Injectable()
export class BeerService {

  constructor(private http: HttpClient, private oktaService: OktaService) {
  }

  getAll(): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    if (this.oktaService.getAccessToken()) {
      const accessToken = this.oktaService.getAccessToken();
      // headers is immutable, so re-assign
      headers = headers.append('Authorization', accessToken.tokenType + ' ' + accessToken.accessToken);
    }
    return this.http.get('http://localhost:8081/good-beers', {headers: headers});
  }
}
