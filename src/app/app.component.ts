import { Component } from '@angular/core';
import './_content/app.less';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SQL-Quiz-Web-App';
  baseUrl = "http://178.62.245.116:8080/api/"
}
