import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ILocation } from "../models/tours";
import { Observable } from "rxjs";
import { API } from "../shared/api";
import { IWeatherResponse } from '../models/map'

@Injectable({
    providedIn: 'root'
})

export class mapService {
    constructor(private http: HttpClient) {}

    getWeather(coord: ILocation): Observable<IWeatherResponse> {
        const params = {
            "latitude": coord.lat,
            "longitude": coord.lng,
            "hourly": "temperature_2m",
            "current": ["is_day", "snowfall", "rain"],
            "forecast_days": 1
        };

        return this.http.get<IWeatherResponse>(API.getWhether,{params})
    }
}