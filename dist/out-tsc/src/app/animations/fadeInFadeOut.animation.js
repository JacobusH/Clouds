import { trigger, animate, style, transition } from '@angular/animations';
export var fadeInFadeOut = trigger('fadeInFadeOut', [
    transition(':enter', [
        style({ opacity: 0 }),
        animate('1500ms ease', style({ opacity: 1 }))
    ]),
    transition(':leave', [
        animate('1500ms ease', style({ opacity: 0 }))
    ])
]);
//# sourceMappingURL=fadeInFadeOut.animation.js.map