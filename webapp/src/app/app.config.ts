import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ApiService } from './services/api.service';
import { IApiService } from './services/i-api-service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: IApiService, useClass: ApiService }
  ]
};
