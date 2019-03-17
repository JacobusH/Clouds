import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragBoxComponent } from './drag-box/drag-box.component';
import { ResizableModule } from 'angular-resizable-element';
import { PatternsComponent } from './patterns.component';
import { StateCircleComponent } from './state-circle/state-circle.component';
import { ColorSketchModule } from 'ngx-color/sketch';

@NgModule({
  declarations: [
    DragBoxComponent,
    PatternsComponent,
    StateCircleComponent
  ],
  imports: [
    CommonModule
    , ColorSketchModule
    , ResizableModule
  ],
  exports: [
    DragBoxComponent
    , PatternsComponent
    , StateCircleComponent
  ]
})
export class PatternsModule { }
