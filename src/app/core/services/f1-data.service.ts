import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { Driver } from "../../features/lap-comparison/models/driver.model";
import { LapData } from "../../features/lap-comparison/models/lap-data.model";
import { TrackMap } from "../../features/lap-comparison/models/track-map.model";
import { LapDataDetail } from "../../features/lap-comparison/models/lap-data-detail.model";

@Injectable({
  providedIn: 'root'
})
export class F1DataService {

  private baseUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.baseUrl = this.configService.getApiBaseUrl();
  }

  getRacingVenues(year: number): Observable<string[]> {
    const url = `${this.baseUrl}/racing_venues/${year}`;
    return this.http.get<string[]>(url);
  }

  getDriversFromVenue(year: number, venue: string, sessionType: string): Observable<Driver[]> {
    const url = `${this.baseUrl}/drivers/${year}/${venue}/${sessionType}`;
    return this.http.get<Driver[]>(url);
  }

  getSessionsFromVenue(year: number, venue: string): Observable<string[]> {
    const url = `${this.baseUrl}/sessions_from_venue/${year}/${venue}`;
    return this.http.get<string[]>(url);
  }

  getLapsFromDriverNumber(year: number, venue: string, sessionType: string, driverNumber: number): Observable<LapData[]> {
    const url = `${this.baseUrl}/laps/${year}/${venue}/${sessionType}/${driverNumber}`;
    return this.http.get<LapData[]>(url);
  }

  getTrackMap(year: number, venue: string, sessionType: string): Observable<TrackMap> {
    const url = `${this.baseUrl}/track_map/${year}/${venue}/${sessionType}`;
    return this.http.get<TrackMap>(url);
  }

  getDriverLapData(year: number, venue: string, sessionType: string, driverNumber: number, lapNumber: number): Observable<LapDataDetail> {
    const url = `${this.baseUrl}/driver_data/${year}/${venue}/${sessionType}/${driverNumber}/${lapNumber}`;
    return this.http.get<LapDataDetail>(url);
  }
}
