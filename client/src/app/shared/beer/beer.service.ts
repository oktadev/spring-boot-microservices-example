import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { OktaAuthService } from '../okta/okta.service';

@Injectable()
export class BeerService {

  constructor(private http: Http, private oktaService: OktaAuthService) {
  }

  getAll(): Observable<any> {
    const accessToken = this.oktaService.signIn.tokenManager.get('accessToken');
    const headers: Headers = new Headers();
    if (accessToken) {
      headers.append('Authorization', accessToken.tokenType + ' ' + accessToken.accessToken);
    }
    const options = new RequestOptions({ headers: headers });
    return this.http.get('http://localhost:8081/good-beers', options)
      .map((response: Response) => response.json());
  }
}
