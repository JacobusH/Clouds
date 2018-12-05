import { trigger, state, animate, style, transition, query, stagger} from '@angular/animations';

export const listFade = 
trigger('listFade', [
  transition('* => *', [ // each time the binding value changes
    query(':leave', [
      stagger(100, [
        animate('1.5s', style({ opacity: 0 }))
      ])
    ], { optional: true }),
    query(':enter', [
      style({ opacity: 0 }),
      stagger(100, [
        animate('1.5s', style({ opacity: 1 }))
      ])
    ], { optional: true })
  ])
])