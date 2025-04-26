import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { ILocation } from '../../../models/tours';
import { mapService } from '../../../services/map.service';
import { IWeatherResponse } from '../../../models/map';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';

// project
import * as olProj from 'ol/proj';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  imports: [CommonModule],
  standalone: true
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @Input() location: ILocation;
  @ViewChild('map') mapDom: ElementRef;
  map: Map;
  weatherData: IWeatherResponse;
  private destroy$ = new Subject<void>();

  constructor(private mapService: mapService) {}

  ngAfterViewInit(): void {
    this.initMap();
    if (this.location) {
      this.getWeatherData();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initMap(): void {
    this.map = new Map({
      target: this.mapDom.nativeElement,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: olProj.fromLonLat([this.location.lng, this.location.lat]),
        zoom: 5,
      }),
    });
  }

  private getWeatherData(): void {
    this.mapService.getWeather(this.location)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.weatherData = data;
          console.log('Данные погоды:', this.weatherData);
          if (data && data.current) {
            this.weatherData = data;
            console.log('Время:', data.current.time);
            console.log('День или Ночь:', data.current.is_day);
          } else {
            console.warn('Данные current отсутствуют в ответе');
          }
        },
        error: (err) => {
          console.error('Ошибка погоды:', err);
        }
      });
  }
}
