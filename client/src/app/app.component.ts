import { Component } from '@angular/core';
import { AuthPortComponent } from 'angular-stormpath';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends AuthPortComponent {
  title = 'app works!';
}
