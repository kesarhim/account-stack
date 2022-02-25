import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-carousel-component',
  templateUrl: './carousel-component.html',
  styleUrls:['./carousel-component.css'],
  providers: [NgbCarouselConfig]
})

export class CarouselComponent implements OnInit {
  private config :NgbCarouselConfig;
  images = [700, 533, 807, 124].map((n) => `https://picsum.photos/id/${n}/900/500`);
  constructor(config: NgbCarouselConfig) { }

  ngOnInit() { }
}
