export interface IWeatherResponse {
    current: IWeatherCurrent,
    hourly: IWeatherHourly
}

export type WeatherCurrentValue = 0 | 1;

export interface IWeatherCurrent {
    is_day: boolean;
    rain: number;
    snowfall: number;
    time: Date;
}

export interface IWeatherHourly {
    time: string[];
    temperature_2m: number[];
}