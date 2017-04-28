import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { StormpathConfiguration } from 'angular-stormpath';
import { Observable } from 'rxjs';

@Injectable()
export class BeerService {

  constructor(private http: Http, private config: StormpathConfiguration) {
  }

  getAll(): Observable<any> {
    let options = new RequestOptions({ withCredentials: true });

    return this.http.get(this.config.endpointPrefix + '/good-beers', options)
      .map((response: Response) => response.json());
  }
}
