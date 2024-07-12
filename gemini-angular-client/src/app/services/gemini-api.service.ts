import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeminiApiService {
  private apiUrl = 'http://localhost:3000'; // Update with your backend URL

  constructor(private http: HttpClient, private configService: ConfigService) { }

  private getHeaders(): Observable<HttpHeaders> {
    return this.configService.getApiKey().pipe(
      map(apiKey => new HttpHeaders().set('x-api-key', apiKey || ''))
    );
  }

  createDbScript(scriptData: any): Observable<any> {
    return this.getHeaders().pipe(
      switchMap(headers => 
        this.http.post<any>(`${this.apiUrl}/create-db-script`, scriptData, { headers })
      )
    );
  }

  explainBuildFailure(buildLog: string): Observable<any> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.post<any>(`${this.apiUrl}/explain-build-failure`, { buildLog }, { headers }))
    );
  }

  explainLogError(logError: string): Observable<any> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.post<any>(`${this.apiUrl}/explain-log-error`, { logError }, { headers }))
    );
  }
}