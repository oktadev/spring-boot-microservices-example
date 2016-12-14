import { Component, OnInit } from '@angular/core';
import { BeerService } from '../shared/beer.service';
import { GiffyService } from '../shared/giffy.service';

@Component({
  selector: 'app-beer-list',
  templateUrl: './beer-list.component.html',
  styleUrls: ['./beer-list.component.css']
})
export class BeerListComponent implements OnInit {
  beers: Array<any>;

  constructor(public beerService: BeerService, public giffyService: GiffyService) {
  }

  ngOnInit() {
    this.beerService.getAll().subscribe(
      data => {
        this.beers = data;
        for (let beer of this.beers) {
          this.giffyService.get(beer.name).subscribe(url => beer.giffyUrl = url);
        }
      },
      error => console.log(error)
    )
  }

}
