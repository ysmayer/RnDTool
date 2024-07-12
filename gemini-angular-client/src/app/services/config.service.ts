// config.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Config {
  apiKey: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config = new BehaviorSubject<Config>({ apiKey: '' });

  setApiKey(apiKey: string) {
    this.config.next({ apiKey });
  }

  getConfig(): Observable<Config> {
    return this.config.asObservable();
  }

  getApiKey(): Observable<string> {
    return this.config.pipe(
      map(config => config.apiKey)
    );
  }
}