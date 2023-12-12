import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, provideFirebaseApp(() => 
    initializeApp({ "projectId": "fir-media-hub", "appId": "1:357292092788:web:7a0fae8e9da0a393b85021", "storageBucket": "fir-media-hub.appspot.com", "apiKey": "AIzaSyBcXAdTAYVRXJIFDkklAthihXwVTcB9Rxs", "authDomain": "fir-media-hub.firebaseapp.com", "messagingSenderId": "357292092788", "measurementId": "G-HM1EEV8QRB" })), provideStorage(() => getStorage())],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
