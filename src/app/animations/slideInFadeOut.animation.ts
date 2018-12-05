import { trigger, state, animate, style, transition} from '@angular/animations';

export const slideInFadeOut = 
  trigger('slideInFadeOut', [
  transition(':enter', [
    style({opacity: 0}),
    animate('500ms ease', style({opacity: 1}))
  ]),
  transition(':leave', [
    animate('500ms ease', style({opacity: 0}))
  ])
  ])