import { Component, OnInit } from '@angular/core';
import { BeerService } from '../shared/beer.service';
import { GiphyService } from '../shared/giphy.service';

@Component({
  selector: 'beer-list',
  templateUrl: './beer-list.component.html',
  styleUrls: ['./beer-list.component.css']
})
export class BeerListComponent implements OnInit {
  beers: Array<any>;

  constructor(public beerService: BeerService, public giphyService: GiphyService) {
  }

  ngOnInit() {
    this.beerService.getAll().subscribe(
      data => {
        this.beers = data;
        for (let beer of this.beers) {
          this.giphyService.get(beer.name).subscribe(url => beer.giphyUrl = url);
        }
      },
      error => console.log(error)
    )
  }

}
