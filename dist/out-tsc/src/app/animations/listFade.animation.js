import { trigger, animate, style, transition, query, stagger } from '@angular/animations';
export var listFade = trigger('listFade', [
    transition('* => *', [
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
]);
//# sourceMappingURL=listFade.animation.js.map