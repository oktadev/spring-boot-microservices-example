import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

@Injectable()
export class BeerService {

  constructor(private http: Http) {
  }

  getAll(): Observable<any> {
    return this.http.get('http://localhost:8081/good-beers')
      .map((response: Response) => response.json());
  }
}
