export interface IWeatherResponse {
    current: IWeatherCurrent,
    hourly: IWeatherHourly
}

export type WeatherCurrentValue = 0 | 1;

export interface IWeatherCurrent {
    temperature_2m: number;
    is_day: boolean;
    rain: number;
    snowfall: number;
}

export interface IWeatherHourly {
    time: string[];
    temperature_2m: number[];
}