import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DataService } from '../data.service';
import { ServiceService } from '../service.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { View1WCComponent } from './View1WC/View1WC.component';
import { View2WCComponent } from './View2WC/View2WC.component';
import { View3WCComponent } from './View3WC/View3WC.component';

@NgModule({
  declarations: [	
    AppComponent,
      View1WCComponent,
      View2WCComponent,
      View3WCComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [ServiceService, DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
