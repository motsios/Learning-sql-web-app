import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from '../app.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-myscore',
  templateUrl: './myscore.component.html',
  styleUrls: ['./myscore.component.css'],
})
export class MyscoreComponent implements OnInit {
  scoresArray: Array<any>;
  constructor(
    private http: HttpClient,
    private url: AppComponent,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.scoresArray = [];
    const headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: localStorage.getItem('token'),
    };
    this.http
      .get<any>(this.url.baseUrl + '/scores/' + localStorage.getItem('id'), {
        headers,
      })
      .subscribe((data) => {
        this.spinner.hide();

        console.log(data.result[0].score_tables);
        if (data.result) {
          this.scoresArray = data.result[0].score_tables;
          if (data.result[0].score_tables.length == 0) {
            Swal.fire('Oops...', 'Δεν έχετε καταχωρημένα Σκορ!', 'error');
          }
        } else {
          Swal.fire('Ουπς...', 'Κάτι πήγε στραβά!Παρακαλώ προσπαθήστε αργότερα.', 'error');
        }
      });
  }
}
