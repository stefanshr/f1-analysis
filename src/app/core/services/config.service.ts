import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  apiBaseUrl: string = '';

  setApiBaseUrl(url: string) {
    this.apiBaseUrl = url;
  }

  getApiBaseUrl() {
    return this.apiBaseUrl;
  }
}
