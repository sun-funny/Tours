import { HttpClient } from "@angular/common/http";
import { API } from "../shared/api";
import { Observable, tap } from "rxjs";
import { Injectable, Inject } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class ConfigService {
    static config: any;

    constructor(private http: HttpClient) {}

    loadObservable(): Observable<any> {
        const jsonFile = `${API.config}`;
        return this.http.get(jsonFile).pipe(
            tap((data) => {
                console.log(data)
            })
        );
    }

    loadPromise(): Promise<any> {
        const jsonFile = `${API.config}`;

        const configPromise = new Promise<any>((resolve, reject) => {
            this.http.get(jsonFile).toPromise().then((response: any) => {
                if (response && typeof (response) === 'object') {
                    if (Array.isArray(response?.rules)) {
                        ConfigService.config = response;
                        resolve(response);
                    } else {
                        reject('Ошибка при инициализации конфига - неверный формат' + response);                    
                    }
                } else {
                    reject('Ошибка при инициализации конфига - неверный формат ответа' + response);
                }
            }).catch((response: any) => {
                reject(`Ошибка при загрузке файла '${jsonFile}': ${JSON.stringify(response)}`);
            });
        });
    
        const promiseArr = [configPromise];
        return Promise.all(promiseArr);
    }
}