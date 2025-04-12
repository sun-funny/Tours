import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, model, OnChanges, 
          OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ITour } from '../../../../models/tours';
import { ToursService } from '../../../../services/tours.service';
import { GalleriaModule } from 'primeng/galleria';
import { NgOptimizedImage } from '@angular/common';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-nearest-tours',
  imports: [GalleriaModule, 
            NgOptimizedImage,
            InputGroupModule,
            InputGroupAddonModule,
            ButtonModule,
            InputTextModule
          ],
  templateUrl: './nearest-tours.component.html',
  styleUrl: './nearest-tours.component.scss'
})
export class NearestToursComponent implements OnInit, OnChanges, AfterViewInit {
  @Input()
  tourNearest: ITour = null;

  @Output() onTourChange = new EventEmitter<ITour>();

  @ViewChild('searchInput') searchInput: ElementRef;
  tourService = inject(ToursService);
  toursArr = model<ITour[]>([]);
  toursArrCopy = model<ITour[]>([]);
  activeLocationId: string;
  
  ngOnInit(): void {
    console.log('tourNearest', this.tourNearest);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changs', changes);
    const tour = changes['tourNearest']?.currentValue as ITour;

    if (tour?.locationId && this.activeLocationId !== tour?.locationId) {
      this.activeLocationId = tour?.locationId;
      this.tourService.getNearestTourByLocationId(this.activeLocationId).subscribe((data) => {
        this.toursArr.set(data);
        this.toursArrCopy.set(data);
      });
    }
  }

  ngAfterViewInit(): void {
    fromEvent<InputEvent>(this.searchInput.nativeElement, 'input').subscribe((ev) => {
      const inputTargetValue = (ev.target as HTMLInputElement).value;
      if (inputTargetValue === '') {
        this.toursArr.set(this.toursArrCopy());
      } else {
        const newTours = this.tourService.searchTours(this.toursArrCopy(), inputTargetValue);
        this.toursArr.set(newTours);
      }
    });
  }

  activeIndexChange(index: number) {
    console.log('index', index);
    const tours = this.toursArr();
    const activeTour = tours.find((el, i) => i === index);
    
    this.onTourChange.emit(activeTour);
  }


}
