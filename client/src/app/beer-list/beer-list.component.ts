import { Component, OnInit } from '@angular/core';
import { BeerService } from '../shared/beer/beer.service';
import { GiphyService } from '../shared/giphy/giphy.service';
import { Stormpath } from 'angular-stormpath';

@Component({
  selector: 'app-beer-list',
  templateUrl: './beer-list.component.html',
  styleUrls: ['./beer-list.component.css']
})
export class BeerListComponent implements OnInit {
  beers: Array<any>;

  constructor(private beerService: BeerService, private giphyService: GiphyService,
              private stormpath: Stormpath) {
    // beerService is called when the app first loads, but hidden
    // because of this, it's not called again after login
    // this listens for the user logging in re-calls beerService
    stormpath.user$.subscribe(data => {
      if (data) {
        this.ngOnInit()
      }
    });
  }

  ngOnInit() {
    this.beerService.getAll().subscribe(
      data => {
        this.beers = data;
        for (const beer of this.beers) {
          this.giphyService.get(beer.name).subscribe(url => beer.giphyUrl = url);
        }
      },
      error => console.log(error)
    );
  }
}
