import { NgModule } from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent }   from './app.component';
import { DatabindingComponent } from "./databinding";
import { EventBindingComponent } from "./databinding";
import { PropertyBindingComponent } from "./databinding";
import { TwoWayBindingComponent } from "./databinding";


@NgModule({
  declarations: [
    AppComponent,
    DatabindingComponent,
    EventBindingComponent,
    PropertyBindingComponent,
    TwoWayBindingComponent
  ],
  imports: [BrowserModule, FormsModule],
  bootstrap: [AppComponent]
})
export class AppModule {}