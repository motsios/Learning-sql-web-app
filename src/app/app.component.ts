import { Component } from '@angular/core';
import './_content/app.less';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SQL-Quiz-Web-App';
  baseUrl = "https://salty-waters-54218.herokuapp.com/api/"
}
