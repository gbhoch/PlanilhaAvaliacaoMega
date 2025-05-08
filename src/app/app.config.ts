import { ApplicationConfig, Type } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { loadMessages, locale } from 'devextreme/localization';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import ptMessages from 'devextreme/localization/messages/pt.json';

registerLocaleData(localePt, 'pt-BR');
locale(navigator.language);
loadMessages(ptMessages);

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideHttpClient()
  ]
};
