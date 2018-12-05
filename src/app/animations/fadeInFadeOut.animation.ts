import { trigger, state, animate, style, transition} from '@angular/animations';

export const fadeInFadeOut = 
  trigger('fadeInFadeOut', [
  transition(':enter', [
    style({opacity: 0}),
    animate('1500ms ease', style({opacity: 1}))
  ]),
  transition(':leave', [
    animate('1500ms ease', style({opacity: 0}))
  ])
  ])