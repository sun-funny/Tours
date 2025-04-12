import { Component, OnInit } from '@angular/core';
import { ToursService } from '../../services/tours.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule, NgIf, Location } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ITour } from '../../models/tours';
import { NearestToursComponent } from './nearest-tours/nearest-tours/nearest-tours.component';

@Component({
  selector: 'app-tour-item',
  imports: [ButtonModule, CommonModule, NgIf, CardModule, RouterLink, NearestToursComponent],
  templateUrl: './tour-item.component.html',
  styleUrl: './tour-item.component.scss'
})
export class TourItemComponent implements OnInit {
  tourId: string = null;
  tour: ITour;
  constructor(private tourService: ToursService,
     private route: ActivatedRoute,
     private router: Router,
     private location: Location) {}

  ngOnInit(): void {
    this.tourId = this.route.snapshot.paramMap.get('id');
    console.log('tourId', this.tourId)

    // Загрузить тур по полученному ID
    this.tourService.getTours().subscribe((data) => {
      if (Array.isArray(data?.tours)) {
        this.tour = data.tours.find(tour => tour.id === this.tourId);
        console.log('tour:', this.tour);
      }
    });
    
    this.route.queryParamMap.subscribe((par) => {
      console.log('***', par)
    })
  }

  onTourChanges(ev: ITour): void {
    this.tour = ev;
    this.location.replaceState('tours/tour/'+this.tour.id)
  }
}
