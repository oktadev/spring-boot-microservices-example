import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operator/map';
import { StormpathConfiguration } from 'angular-stormpath';

@Injectable()
export class BeerService {

  constructor(public http: Http, public config: StormpathConfiguration) {}

  getAll(): Observable<any> {
    let options = new RequestOptions({ withCredentials: true });

    return this.http.get(this.config.endpointPrefix + '/good-beers', options)
      .map((response: Response) => response.json());
  }
}
