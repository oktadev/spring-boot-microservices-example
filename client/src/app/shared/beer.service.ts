import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operator/map';

@Injectable()
export class BeerService {

  constructor(public http: Http) {}

  getAll(): Observable<any> {
    return this.http.get('http://localhost:8081/good-beers')
      .map((response: Response) => response.json());
  }
}
