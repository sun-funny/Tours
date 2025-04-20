import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ToursService } from '../../services/tours.service';
import { CardModule } from 'primeng/card';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ITour } from '../../models/tours';
import { SearchPipe } from '../../shared/pipes/search.pipe';
import { FormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { HighlightActiveDirective } from '../../shared/directives/highlight-active.directive';
import { isValid } from "date-fns";

@Component({
  selector: 'app-tours',
  imports: [
    CardModule, 
    InputGroupAddonModule, 
    InputGroupModule, 
    ButtonModule, 
    InputTextModule, 
    SearchPipe, 
    FormsModule,
    HighlightActiveDirective],
  templateUrl: './tours.component.html',
  styleUrl: './tours.component.scss'
})

export class ToursComponent implements OnInit {
  tours: ITour[] = [];
  toursStore: ITour[] = [];
  searchValue = '';
  
  constructor(private toursService: ToursService,
    private route: ActivatedRoute,
    private router: Router){}

  ngOnInit(): void {
    this.toursService.tourType$.subscribe((tour) => {
      console.log('tour', tour)

      switch (tour.key) {
        case 'group':
          this.tours = this. toursStore.filter((el) => el.type === 'group')
        break;
        case 'single':
          this.tours = this. toursStore.filter((el) => el.type === 'single')
        break;
        case 'all':
          this.tours = this. toursStore.filter((el) => el.type === 'all')
        break;
      }
   
      })
      // Date
      this.toursService.tourDate$.subscribe((date) => {
        console.log('****date', date);
        this.tours = this.toursStore.filter((tour) => {
          if (isValid(new Date(tour.date))) {
            const tourDate = new Date(tour.date).setHours(0, 0, 0, 0);
            const calendarDate = new Date(tour.date).setHours(0, 0, 0);
            return tourDate === calendarDate;
          } else {
            return false
          }
        })
      
      console.log('activateRoute', this.route)

      this.toursService.getTours().subscribe((data) => {
        if (Array.isArray(data?.tours)) {
          this.tours = data.tours;
          this.toursStore = [...data.tours];
        }
      });

    });
  }

  goToTour(item: any): void {
    this.router.navigate(['tour', item.id], {relativeTo: this.route});
  }

  searchTour(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    const targetValue = target.value;
    this.tours = this.toursService.searchTours(this.toursStore, targetValue);
  }

  selectActive(index: number): void {
    console.log('index', index);
    const targetTour = this.tours.find((tour, i) => i=== index);
    if (targetTour) {
      this.goToTour(targetTour);
    }
  }
 }