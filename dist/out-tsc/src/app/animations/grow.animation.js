import { trigger, animate, style, transition } from '@angular/animations';
export var grow = trigger('grow', [
    transition(':enter', [
        style({ opacity: 0, transform: 'scale(0)' }),
        animate('2000ms ease', style({ opacity: 1, transform: 'scale(1)' }))
    ]),
    transition(':leave', [
        animate('1500ms ease', style({ opacity: 0 }))
    ])
]);
export var growSlowly = trigger('growSlowly', [
    transition(':enter', [
        style({ transform: 'scale(0)' }),
        animate('120000ms ease', style({ opacity: 1, transform: 'scale(1)' }))
    ]),
    transition(':leave', [
        animate('1500ms ease', style({ opacity: 0 }))
    ])
]);
//# sourceMappingURL=grow.animation.js.map