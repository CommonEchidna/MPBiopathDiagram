import { Component } from '@angular/core';
import {ANIMATIONS} from "./config/animations";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: ANIMATIONS.routesAnimation
})
export class AppComponent {
  title = 'pathway-network-diagram-frontend';
}
