import { NgModule } from '@angular/core';
import { DragDropModule  } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SunMoonComponent } from './components/sun-moon/sun-moon.component';


@NgModule({
  imports: [ 
    CommonModule
    , DragDropModule 
  ],
  declarations: [
    HeaderComponent,
    SunMoonComponent
  ],
  exports: [
    HeaderComponent
    , SunMoonComponent
  ]
})
export class SharedModule { }
