import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ConfigService } from './services/config.service';

@NgModule({
    imports: [
        HttpClientModule,
    ],
    providers: [
        ConfigService,
    ],
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import it in the AppModule only.');
        }
    }
}
