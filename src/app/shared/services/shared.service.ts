import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private telemetryDataSubject = new BehaviorSubject<number | null>(null);
  telemetryData$ = this.telemetryDataSubject.asObservable();

  updateTelemetryData(distance: number) {
    this.telemetryDataSubject.next(distance);
  }
}
