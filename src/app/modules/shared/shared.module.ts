import { NgModule } from '@angular/core';
import { DragDropModule  } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FlowersComponent } from './components/flowers/flowers.component';
import { SunMoonComponent } from './components/sun-moon/sun-moon.component';


@NgModule({
  imports: [ 
    CommonModule
    , DragDropModule 
  ],
  declarations: [
    HeaderComponent,
    FlowersComponent,
    SunMoonComponent
  ],
  exports: [
    HeaderComponent
    , FlowersComponent
    , SunMoonComponent
  ]
})
export class SharedModule { }
