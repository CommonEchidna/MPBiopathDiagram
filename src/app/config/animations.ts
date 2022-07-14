import { animate, style, transition, trigger } from '@angular/animations';

export const ANIMATIONS = {
  routesAnimation: [
    trigger('routeAnimations', [
        transition('* => *', [
          style({opacity: 0}),
          animate('250ms', style({opacity: 1}))
        ])
      ]
    )
  ]
};
