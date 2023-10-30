import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ConfigService } from './services/config.service';
import { MessageService } from "primeng/api";
import { ErrorInterceptor } from "./interceptors/error-interceptor";

@NgModule({
  imports: [
    HttpClientModule,
  ],
  providers: [
    ConfigService,
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only.');
    }
  }
}
