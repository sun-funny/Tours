import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API } from "../shared/api";
import { catchError, delay, forkJoin, map, Observable, of, Subject, switchMap, tap, withLatestFrom } from "rxjs";
import { Coords, ICountriesResponseItem, ITour, ITourServerResponse } from "../models/tours";
import { mapService } from "./map.service"; 
import { LoadedService } from "./loader.service";
import { BasketService } from "./basket.service";

@Injectable({
    providedIn: 'root'
})

export class ToursService {
    //type
    private tourTypeSubject = new Subject<any>();
    readonly tourType$ = this.tourTypeSubject.asObservable();
    //date
    private tourDateSubject = new Subject<Date>();
    readonly tourDate$ = this.tourDateSubject.asObservable();

    constructor(private http: HttpClient, 
        private mapService: mapService, 
        private loaderService: LoadedService,
        private basketService: BasketService) {} 

    getTours(): Observable<ITour[]> {

        // set loader
        this.loaderService.setLoader(true)

        const countries = this.http.get<ICountriesResponseItem[]>(API.countries);
        const tours = this.http.get<ITourServerResponse>(API.tours);

        // parallel
        return forkJoin<[ICountriesResponseItem[], ITourServerResponse]>([countries, tours]).pipe(
            delay(1000),
            withLatestFrom(this.basketService.basketStore$),
            map(([data, basketData]) => {

                let toursWithCountries = [] as ITour[];
                const toursArr = data[1].tours;
                const countriesMap = new Map(); 
                
                data[0].forEach(country => {
                    countriesMap.set(country.iso_code2, country);
                });

                if (Array.isArray(toursArr)) {
                    toursWithCountries = toursArr.map((tour) => {
                        const isTourInBasket = basketData.find((basketTour) => basketTour.id === tour.id)

                        if (isTourInBasket) {
                            tour.inBasket = true;
                        }
                        return {
                            ...tour,
                            country: countriesMap.get(tour.code) || null
                        }    
                    });
                }
                return toursWithCountries;
            }),
            tap((data) => {
                this.loaderService.setLoader(false);
            }, (err) => {
                this.loaderService.setLoader(false);
            }),
            catchError((err) => {
                this.loaderService.setLoader(false);
                return of (null);
            })
        )
    }
    
    getTourById(id: string): Observable<ITour> {
        return this.http.get<ITour>(`${API.tour}/${id}`);
    }

    deleteTourById(id: string): Observable<ITour> {
        return this.http.delete<ITour>(`${API.tour}/${id}`);
    }

    getNearestTourByLocationId(id: string): Observable<ITour[]> {
        return this.http.get<ITour[]>(API.nearestTours, {
            params: {locationId: id}
        });
    }

    searchTours(tours: ITour[], value: string): ITour[] {
        if (Array.isArray(tours)) {
            return tours.filter((tour) => {
                if (tour && typeof tour.name === 'string') {
                    return tour.name.toLowerCase().includes(value.toLowerCase());
                } else {
                    return false;
                }
            });
        } else {
            return [];
        }
    }

    initChangeTourType(val: any): void {
        this.tourTypeSubject.next(val);
    }

    initChangeTourDate(val: Date): void {
        this.tourDateSubject.next(val);
    }

    getCountryByCode(code: string): Observable<any> {
        return this.http.get<Coords[]>(API.countryByCode, {params: {codes: code}}).pipe(
            // send new data
            map((countriDataArr) => countriDataArr[0]), //-данные получены из source Observable

            //send new Observable
            switchMap((countrieData) => {
                const coords = {lat: countrieData.latlng[0], lng: countrieData.latlng[1]};
            
                //new Observable
                return this.mapService.getWeather(coords).pipe(
                    map((weatherResponse) => {
                        const current = weatherResponse.current;
                        const hourly = weatherResponse.hourly;
        
                        const weatherData = {
                            isDay: current.is_day,
                            snowfall: current.snowfall,
                            rain: current.rain,
                            currentWeather: hourly.temperature_2m[10] // индекс 10 - температура днем
                        };

                        return {countrieData, weatherData} //return new data for new outer Observable
                    })
                );
            })
        );
    }

    postOrder(orderBody: any): Observable<any> {
        return this.http.post<any>(API.order, orderBody);
    }
}