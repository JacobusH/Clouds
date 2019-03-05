import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragBoxComponent } from './drag-box/drag-box.component';
import { ResizableModule } from 'angular-resizable-element';
import { PatternsComponent } from './patterns.component';
import { StateCircleComponent } from './state-circle/state-circle.component';

@NgModule({
  declarations: [
    DragBoxComponent,
    PatternsComponent,
    StateCircleComponent
  ],
  imports: [
    CommonModule
    , ResizableModule
  ],
  exports: [
    DragBoxComponent
    , PatternsComponent
    , StateCircleComponent
  ]
})
export class PatternsModule { }
