import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from '@angular/material';

import { BeerListComponent } from './beer-list.component';
import { StormpathModule } from 'angular-stormpath';
import { BeerService } from '../shared/beer/beer.service';
import { GiphyService } from '../shared/giphy/giphy.service';

describe('BeerListComponent', () => {
  let component: BeerListComponent;
  let fixture: ComponentFixture<BeerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BeerListComponent],
      imports: [MaterialModule, StormpathModule],
      providers: [BeerService, GiphyService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
