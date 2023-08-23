import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClient } from "@angular/common/http";
import { ConfigService } from "./core/services/config.service";
import { CoreModule } from "./core/core.module";
import { FeaturesModule } from "./features/features.module";
import { SharedModule } from "./shared/shared.module";

export function initializeApp(http: HttpClient, configService: ConfigService) {
  return () => new Promise<void>((resolve, reject) => {
    http.get('/assets/config.json')
      .toPromise()
      .then((config: any) => {
        configService.setApiBaseUrl(config.apiBaseUrl);
        console.log("Configuration Loaded: ", config);
        resolve();
      })
      .catch((err) => {
        console.error("Could not load configuration", err);
        reject(err);
      });
  });
}

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        CoreModule,
        SharedModule,
        FeaturesModule
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: initializeApp,
            deps: [HttpClient, ConfigService],
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
