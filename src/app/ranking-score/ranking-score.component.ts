import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppComponent } from '../app.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-ranking-score',
  templateUrl: './ranking-score.component.html',
  styleUrls: ['./ranking-score.component.css'],
})
export class RankingScoreComponent implements OnInit {
  userid = '';
  token = '';
  bestScoreOf25Array: Array<any>;
  bestScoreOf15Array: Array<any>;

  constructor(
    private router: Router,
    private http: HttpClient,
    private url: AppComponent,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.token = localStorage.getItem('token');
    this.getStudentsBestScore(this.token);
  }

  getStudentsBestScore(token) {
    const headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: token,
    };
    this.http
      .get<any>(this.url.baseUrl + 'bestscores/25 Questions', { headers })
      .subscribe((data) => {
        if (data.result) {
          this.bestScoreOf25Array = data.result;
          console.log(this.bestScoreOf25Array);
          this.http
            .get<any>(this.url.baseUrl + 'bestscores/15 Questions', { headers })
            .subscribe((data) => {
              this.spinner.hide();
              if (data.result) {
                this.bestScoreOf15Array = data.result;
                console.log(this.bestScoreOf15Array);
              } else {
                Swal.fire('', 'Δεν υπάρχουν διαθέσιμα Σκορ ακόμη!', 'error');
              }
            });
        } else {
          Swal.fire('Ουπς...', 'Κάτι πήγε στραβά!Παρακαλώ προσπαθήστε αργότερα.', 'error');
        }
      });
  }
}
