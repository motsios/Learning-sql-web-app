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
    private spinner: NgxSpinnerService
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
          for (var i = 0; i < data.result.length; i++) {
            data.result[i].score_tables[0].createdAt = new Date(
              data.result[i].score_tables[0].createdAt
            ).toString();

            if (data.result[i].score_tables[0].createdAt.includes('Mon'))
              data.result[i].score_tables[0].createdAt = data.result[
                i
              ].score_tables[0].createdAt.replace('Mon', 'Δευτέρα');
            else if (data.result[i].score_tables[0].createdAt.includes('Tue'))
              data.result[i].score_tables[0].createdAt = data.result[
                i
              ].score_tables[0].createdAt.replace('Tue', 'Τρίτη');
            else if (data.result[i].score_tables[0].createdAt.includes('Wed'))
              data.result[i].score_tables[0].createdAt = data.result[
                i
              ].score_tables[0].createdAt.replace('Wed', 'Τετάρτη');
            else if (data.result[i].score_tables[0].createdAt.includes('Thu'))
              data.result[i].score_tables[0].createdAt = data.result[
                i
              ].score_tables[0].createdAt.replace('Thu', 'Πέμπτη');
            else if (data.result[i].score_tables[0].createdAt.includes('Fri'))
              data.result[i].score_tables[0].createdAt = data.result[
                i
              ].score_tables[0].createdAt.replace('Fri', 'Παρασκευή');
            else if (data.result[i].score_tables[0].createdAt.includes('Sat'))
              data.result[i].score_tables[0].createdAt = data.result[
                i
              ].score_tables[0].createdAt.replace('Sat', 'Σαββατο');
            else if (data.result[i].score_tables[0].createdAt.includes('Sun'))
              data.result[i].score_tables[0].createdAt = data.result[
                i
              ].score_tables[0].createdAt.replace('Sun', 'Κυριακή');

            if (data.result[i].score_tables[0].createdAt.includes('Jan'))
              data.result[i].score_tables[0].createdAt = data.result[
                i
              ].score_tables[0].createdAt.replace('Jan', 'Ιανουάριος');
            else if (data.result[i].score_tables[0].createdAt.includes('Feb'))
              data.result[i].score_tables[0].createdAtt = data.result[
                i
              ].score_tables[0].createdAt.replace('Feb', 'Φεβρουάριος');
            else if (data.result[i].score_tables[0].createdAt.includes('Mar'))
              data.result[i].score_tables[0].createdAt = data.result[
                i
              ].score_tables[0].createdAt.replace('Mar', 'Μάρτιος');
            else if (data.result[i].score_tables[0].createdAt.includes('Apr'))
              data.result[i].score_tables[0].createdAt = data.result[
                i
              ].score_tables[0].createdAt.replace('Apr', 'Απρίλιος');
            else if (data.result[i].score_tables[0].createdAt.includes('May'))
              data.result[i].score_tables[0].createdAt = data.result[
                i
              ].score_tables[0].createdAt.replace('May', 'Μάιος');
            else if (data.result[i].score_tables[0].createdAt.includes('Jun'))
              data.result[i].score_tables[0].createdAt = data.result[
                i
              ].score_tables[0].createdAt.replace('Jun', 'Ιούνιος');
            else if (data.result[i].score_tables[0].createdAt.includes('Jul'))
              data.result[i].score_tables[0].createdAt = data.result[
                i
              ].score_tables[0].createdAt.replace('Jul', 'Ιούλιος');
            else if (data.result[i].score_tables[0].createdAt.includes('Aug'))
              data.result[i].score_tables[0].createdAt = data.result[
                i
              ].score_tables[0].createdAt.replace('Aug', 'Αύγουστος');
            else if (data.result[i].score_tables[0].createdAt.includes('Sep'))
              data.result[i].score_tables[0].createdAt = data.result[
                i
              ].score_tables[0].createdAt.replace('Sep', 'Σεπτέμβριος');
            else if (data.result[i].score_tables[0].createdAt.includes('Oct'))
              data.result[i].score_tables[0].createdAt = data.result[
                i
              ].score_tables[0].createdAt.replace('Oct', 'Οκτώβριος');
            else if (data.result[i].score_tables[0].createdAt.includes('Nov'))
              data.result[i].score_tables[0].createdAt = data.result[
                i
              ].score_tables[0].createdAt.replace('Nov', 'Νοέμβριος');
            else if (data.result[i].score_tables[0].createdAt.includes('Dec'))
              data.result[i].score_tables[0].createdAt = data.result[
                i
              ].score_tables[0].createdAt.replace('Dec', 'Δεκέμβριος');
          }
          this.bestScoreOf25Array = data.result;
          console.log(this.bestScoreOf25Array);
          this.http
            .get<any>(this.url.baseUrl + 'bestscores/15 Questions', { headers })
            .subscribe((data) => {
              this.spinner.hide();
              if (data.result) {
                for (var i = 0; i < data.result.length; i++) {
                  data.result[i].score_tables[0].createdAt = new Date(
                    data.result[i].score_tables[0].createdAt
                  ).toString();

                  if (data.result[i].score_tables[0].createdAt.includes('Mon'))
                    data.result[i].score_tables[0].createdAt = data.result[
                      i
                    ].score_tables[0].createdAt.replace('Mon', 'Δευτέρα');
                  else if (
                    data.result[i].score_tables[0].createdAt.includes('Tue')
                  )
                    data.result[i].score_tables[0].createdAt = data.result[
                      i
                    ].score_tables[0].createdAt.replace('Tue', 'Τρίτη');
                  else if (
                    data.result[i].score_tables[0].createdAt.includes('Wed')
                  )
                    data.result[i].score_tables[0].createdAt = data.result[
                      i
                    ].score_tables[0].createdAt.replace('Wed', 'Τετάρτη');
                  else if (
                    data.result[i].score_tables[0].createdAt.includes('Thu')
                  )
                    data.result[i].score_tables[0].createdAt = data.result[
                      i
                    ].score_tables[0].createdAt.replace('Thu', 'Πέμπτη');
                  else if (
                    data.result[i].score_tables[0].createdAt.includes('Fri')
                  )
                    data.result[i].score_tables[0].createdAt = data.result[
                      i
                    ].score_tables[0].createdAt.replace('Fri', 'Παρασκευή');
                  else if (
                    data.result[i].score_tables[0].createdAt.includes('Sat')
                  )
                    data.result[i].score_tables[0].createdAt = data.result[
                      i
                    ].score_tables[0].createdAt.replace('Sat', 'Σάββατο');
                  else if (
                    data.result[i].score_tables[0].createdAt.includes('Sun')
                  )
                    data.result[i].score_tables[0].createdAt = data.result[
                      i
                    ].score_tables[0].createdAt.replace('Sun', 'Κυριακή');

                  if (data.result[i].score_tables[0].createdAt.includes('Jan'))
                    data.result[i].score_tables[0].createdAt = data.result[
                      i
                    ].score_tables[0].createdAt.replace('Jan', 'Ιανουάριος');
                  else if (
                    data.result[i].score_tables[0].createdAt.includes('Feb')
                  )
                    data.result[i].score_tables[0].createdAtt = data.result[
                      i
                    ].score_tables[0].createdAt.replace('Feb', 'Φεβρουάριος');
                  else if (
                    data.result[i].score_tables[0].createdAt.includes('Mar')
                  )
                    data.result[i].score_tables[0].createdAt = data.result[
                      i
                    ].score_tables[0].createdAt.replace('Mar', 'Μάρτιος');
                  else if (
                    data.result[i].score_tables[0].createdAt.includes('Apr')
                  )
                    data.result[i].score_tables[0].createdAt = data.result[
                      i
                    ].score_tables[0].createdAt.replace('Apr', 'Απρίλιος');
                  else if (
                    data.result[i].score_tables[0].createdAt.includes('May')
                  )
                    data.result[i].score_tables[0].createdAt = data.result[
                      i
                    ].score_tables[0].createdAt.replace('May', 'Μάιος');
                  else if (
                    data.result[i].score_tables[0].createdAt.includes('Jun')
                  )
                    data.result[i].score_tables[0].createdAt = data.result[
                      i
                    ].score_tables[0].createdAt.replace('Jun', 'Ιούνιος');
                  else if (
                    data.result[i].score_tables[0].createdAt.includes('Jul')
                  )
                    data.result[i].score_tables[0].createdAt = data.result[
                      i
                    ].score_tables[0].createdAt.replace('Jul', 'Ιούλιος');
                  else if (
                    data.result[i].score_tables[0].createdAt.includes('Aug')
                  )
                    data.result[i].score_tables[0].createdAt = data.result[
                      i
                    ].score_tables[0].createdAt.replace('Aug', 'Αύγουστος');
                  else if (
                    data.result[i].score_tables[0].createdAt.includes('Sep')
                  )
                    data.result[i].score_tables[0].createdAt = data.result[
                      i
                    ].score_tables[0].createdAt.replace('Sep', 'Σεπτέμβριος');
                  else if (
                    data.result[i].score_tables[0].createdAt.includes('Oct')
                  )
                    data.result[i].score_tables[0].createdAt = data.result[
                      i
                    ].score_tables[0].createdAt.replace('Oct', 'Οκτώβριος');
                  else if (
                    data.result[i].score_tables[0].createdAt.includes('Nov')
                  )
                    data.result[i].score_tables[0].createdAt = data.result[
                      i
                    ].score_tables[0].createdAt.replace('Nov', 'Νοέμβριος');
                  else if (
                    data.result[i].score_tables[0].createdAt.includes('Dec')
                  )
                    data.result[i].score_tables[0].createdAt = data.result[
                      i
                    ].score_tables[0].createdAt.replace('Dec', 'Δεκέμβριος');
                }
                this.bestScoreOf15Array = data.result;
                console.log(this.bestScoreOf15Array);
              } else {
                Swal.fire('', 'Δεν υπάρχουν διαθέσιμα Σκορ ακόμη!', 'error');
              }
            });
        } else {
          Swal.fire(
            'Ουπς...',
            'Κάτι πήγε στραβά!Παρακαλώ προσπαθήστε αργότερα.',
            'error'
          );
        }
      });
  }
}
