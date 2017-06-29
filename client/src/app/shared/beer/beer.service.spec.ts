import { TestBed, inject } from '@angular/core/testing';

import { BeerService } from './beer.service';
import { BaseRequestOptions, Http, ConnectionBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { StormpathModule } from 'angular-stormpath';

describe('BeerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BeerService, {
        provide: Http, useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
          return new Http(backend, defaultOptions);
        },
        deps: [MockBackend, BaseRequestOptions]
      },
        {provide: MockBackend, useClass: MockBackend},
        {provide: BaseRequestOptions, useClass: BaseRequestOptions}],
      imports: [StormpathModule]
    });
  });

  it('should ...', inject([BeerService], (service: BeerService) => {
    expect(service).toBeTruthy();
  }));
});
