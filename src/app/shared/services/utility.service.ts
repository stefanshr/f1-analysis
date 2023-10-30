import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  formatTime(value: number | string): string {
    const totalSeconds = parseFloat(value.toString());

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const milliseconds = Math.round((totalSeconds % 1) * 1000);

    const paddedMinutes = String(minutes).padStart(1, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');
    const paddedMilliseconds = String(milliseconds).padStart(3, '0');

    return `${paddedMinutes}:${paddedSeconds}:${paddedMilliseconds}`;
  }
}
