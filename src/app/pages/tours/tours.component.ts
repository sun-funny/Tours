import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ToursService } from '../../services/tours.service';
import { CardModule } from 'primeng/card';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IFilterTypeLogic, ILocation, ITour } from '../../models/tours';
import { SearchPipe } from '../../shared/pipes/search.pipe';
import { FormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { HighlightActiveDirective } from '../../shared/directives/highlight-active.directive';
import { isValid } from "date-fns";
import { Subject, takeUntil } from 'rxjs';
import { MapComponent } from '../../shared/components/map/map.component';
import { DialogModule } from 'primeng/dialog';
import { BasketService } from '../../services/basket.service';

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
    HighlightActiveDirective,
    MapComponent,
    DialogModule],
  templateUrl: './tours.component.html',
  styleUrl: './tours.component.scss'
})

export class ToursComponent implements OnInit, OnDestroy {
  tours: ITour[] = [];
  toursStore: ITour[] = [];
  searchValue = '';
  dateTourFilter: Date;
  typeTourFilter: IFilterTypeLogic = {key: 'all'};
  destroyer = new Subject<boolean>();
  showModal = false;
  location: ILocation = null;
  selectedTour: ITour = null;
  
  constructor(private toursService: ToursService,
    private route: ActivatedRoute,
    private router: Router,
    private basketService: BasketService){}

  ngOnInit(): void {

      //Types
      this.toursService.tourType$.pipe(takeUntil(this.destroyer)).subscribe((tour) => {
        this.typeTourFilter = tour;
        this.initTourFilterLogic();
      })

      //Date
      this.toursService.tourDate$.pipe(takeUntil(this.destroyer)).subscribe((date) => {
        this.dateTourFilter = date;
        this.initTourFilterLogic();
      })

      console.log('activateRoute', this.route)

      this.toursService.getTours().subscribe((data) => {
        if (Array.isArray(data)) {
          this.tours = data;
          this.toursStore = [...data];
        }
      }, (err) => {
        console.log('****', err)

      });
  }

  ngOnDestroy(): void {
    this.destroyer.next(true);
    this.destroyer.complete();
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

  initTourFilterLogic(): void {

    // Type
    if (this.typeTourFilter.key) {
      switch (this.typeTourFilter.key) {
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
    }

    //Date
    if (this.dateTourFilter) {
        this.tours = this.toursStore.filter((tour) => {
          if (this.dateTourFilter && isValid(new Date(tour.date))) {
            const tourDate = new Date(tour.date).setHours(0, 0, 0, 0);
            const calendarDate = new Date(tour.date).setHours(0, 0, 0);
            return tourDate === calendarDate;
          } else {
            return false
          }
        })
    }
  }

  getCountryDetail(ev: Event, code: string, tour: ITour): void {
    ev.stopImmediatePropagation();
    this.toursService.getCountryByCode(code).subscribe((data) => {
      if (data) {
        const countryInfo = data.countrieData;
        this.location = {
          lat: countryInfo.latlng[0], 
          lng: countryInfo.latlng[1],
          name: countryInfo.name
        };
        this.selectedTour = tour;
        this.showModal = true;
      }
    });
  }

  deleteTour(ev: Event, tourId: string): void {
    ev.stopImmediatePropagation();
    
    if (confirm('Вы уверены, что хотите удалить этот тур?')) {
      this.toursService.deleteTourById(tourId).subscribe({
        next: () => {
          this.tours = this.tours.filter(tour => tour.id !== tourId);
          this.toursStore = this.toursStore.filter(tour => tour.id !== tourId);
          
          console.log('Тур удален');
        },
        error: (err) => {
          console.error('Не удалось удалить тур:', err);
        }
      });
    }
  }

  setItemToBasket(ev: Event, item: ITour): void {
    ev.stopPropagation();
    this.basketService.setItemToBasket(item);
  }

  removeItemFromBasket(ev: Event, item: ITour): void {
    ev.stopPropagation();
    this.basketService.removeItemFromBasket(item);
  }

 }