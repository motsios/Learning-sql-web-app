import { HttpClient } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { AppComponent } from '../app.component';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-questions-to-tables-true-or-false',
  templateUrl: './questions-to-tables-true-or-false.component.html',
  styleUrls: ['./questions-to-tables-true-or-false.component.css'],
})
export class QuestionsToTablesTrueOrFalseComponent implements OnInit {
  tableArrayName = [];
  tableColumnsArray = [];
  tableColumnsArray2 = [];
  dataOfEachTableArray = [];
  secondtableColumnsArray = [];
  seconddataOfEachTableArray = [];
  header_tale_name = '';
  fillfieldsquestionsArray = [];
  hideWordArray = [];
  role = '';
  secondTable = '';
  questionid = '0';
  questionidToNumber;
  resultcolumnsArray = [];
  resultdataArray = [];
  errorText = '';
  correctAnswers = 0;
  startTimer = false;
  timer: number = 0;
  converttimer;
  interval;
  load = false;
  questionWithField = '';
  heddenWords = '';
  splitWords = [];
  hiddenWordsArray = [];

  public selection: string;

  random;
  answer;

  constructor(
    private http: HttpClient,
    private url: AppComponent,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.paramMap.subscribe(async (params) => {
      this.questionid = await params.get('id');
      this.questionidToNumber = Number(this.questionid);
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('token') == null) {
      this.router.navigate(['']);
    }
    this.spinner.show();
    this.role = localStorage.getItem('role');
    const headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: localStorage.getItem('token'),
    };
    this.http
      .get<any>(this.url.baseUrl + '/getalltables', { headers })
      .subscribe((data) => {
        console.log(data);
        this.spinner.hide();
        if (data.result) {
          for (var i = 0; i < data.result.length; i++) {
            this.tableArrayName.push(data.result[i]);
          }
          console.log(this.tableArrayName);
        } else {
          Swal.fire('', 'Δεν υπάρχουν Πίνακες!', 'error');
        }
      });
  }
  startTimerFun() {
    this.interval = setInterval(() => {
      this.converttimer = this.toTime(this.timer);
      this.timer++;
    }, 1000);
  }
  toTime(seconds) {
    var date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  }
  async eachTableColumns(table, name) {
    this.startTimer = true;
    this.startTimerFun();
    this.header_tale_name = name;
    this.tableColumnsArray = [];
    this.tableColumnsArray2 = [];
    this.dataOfEachTableArray = [];
    this.tableColumnsArray2 = table.temparray2;
    this.seconddataOfEachTableArray = [];
    this.secondtableColumnsArray = [];

    console.log(this.tableColumnsArray2);
    const headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: localStorage.getItem('token'),
    };

    for (var i = 0; i < this.tableColumnsArray2.length; i++) {
      if (
        this.tableColumnsArray2[i].OTHER_VALUES.REFERENCED_TABLE_NAME != null
      ) {
        this.secondTable = this.tableColumnsArray2[
          i
        ].OTHER_VALUES.REFERENCED_TABLE_NAME;
        console.log(
          this.tableColumnsArray2[i].OTHER_VALUES.REFERENCED_TABLE_NAME
        );
      }
    }
    this.http
      .post<any>(
        this.url.baseUrl + '/getaldataofatable',
        { sqlQueryString: 'SELECT * FROM' + ' `' + table.table_name + '`' },
        { headers }
      )
      .subscribe((data) => {
        console.log(data);
        if (data.result == 'Empty Table') {
          Swal.fire('', 'Άδεια Κελιά!', 'warning');
        } else {
          this.tableColumnsArray = Object.keys(data.result[0][0]);
          this.dataOfEachTableArray = data.result[0];
        }
      });

    if (this.secondTable != '') {
      for (var i = 0; i < this.tableArrayName.length; i++) {
        if (this.secondTable == this.tableArrayName[i].table_name) {
          for (var j = 0; j < this.tableArrayName[i].temparray.length; j++) {
            console.log(this.tableArrayName[i].temparray[j].COLUMN_NAME);
            this.secondtableColumnsArray.push(
              this.tableArrayName[i].temparray[j].COLUMN_NAME
            );
          }
        }
      }

      this.http
        .post<any>(
          this.url.baseUrl + '/getaldataofatable',
          { sqlQueryString: 'SELECT * FROM' + ' `' + this.secondTable + '`' },
          { headers }
        )
        .subscribe((data) => {
          if (data.result == 'Empty Table') {
            Swal.fire('', 'Άδεια Κελιά!', 'warning');
          } else {
            this.seconddataOfEachTableArray = data.result[0];
          }
        });
    }

    this.http
      .post<any>(
        this.url.baseUrl + 'getallsqlqueriesfromspecifictable',
        { tablename: name },
        { headers }
      )
      .subscribe((data) => {
        this.load = true;
        console.log(data.result);
        if (data.result) {
          this.fillfieldsquestionsArray = data.result.sql_random_queries;
          console.log(this.fillfieldsquestionsArray);

          if (this.fillfieldsquestionsArray.length == 0) {
            Swal.fire(
              '',
              'Το Τεστ για τον Πίνακα ' +
                this.header_tale_name +
                ' δεν είναι ακόμη έτοιμο καθώς δεν περιέχει δεδομένα ή SQL Ερωτήσεις!',
              'error'
            );
            this.tableArrayName = [];
            this.tableColumnsArray = [];
            this.tableColumnsArray2 = [];
            this.dataOfEachTableArray = [];
            this.secondtableColumnsArray = [];
            this.seconddataOfEachTableArray = [];
            this.header_tale_name = '';
            this.fillfieldsquestionsArray = [];
            this.hideWordArray = [];
            this.role = '';
            this.secondTable = '';
            this.questionid = '0';
            this.questionidToNumber;
            this.resultcolumnsArray = [];
            this.hiddenWordsArray = [];
            this.resultdataArray = [];
            this.errorText = '';
            this.correctAnswers = 0;
            this.startTimer = false;
            this.timer = 0;
            this.converttimer;
            this.load = false;
            this.questionWithField = '';
            this.heddenWords = '';
            this.splitWords = [];
            clearInterval(this.interval);
            this.ngOnInit();
          } else {
            this.random = this.randomInteger(1, 2);
            if (this.random == 1) {
              this.questionWithField = this.fillfieldsquestionsArray[0].sql_query;
            } else {
              var nextQueryShows = 1 % this.fillfieldsquestionsArray.length;
              console.log('tyxaia');
              this.questionWithField = this.fillfieldsquestionsArray[
                nextQueryShows
              ].sql_query;
            }
            const body = {
              sqlQueryString: this.fillfieldsquestionsArray[0].sql_query,
            };
            this.http
              .post<any>(this.url.baseUrl + 'executesqlquery', body, {
                headers,
              })
              .subscribe((data) => {
                console.log(data);
                if (Array.isArray(data.result)) {
                  if (data.result.length == 0) {
                    this.errorText = 'Το ερώτημα επιστρέφει κενό πίνακα!';
                  } else {
                    this.resultcolumnsArray = Object.keys(data.result[0]);
                    this.resultdataArray = data.result;

                    for (var i = 0; i < this.resultcolumnsArray.length; i++) {
                      this.hiddenWordsArray.push(this.resultcolumnsArray[i]);
                    }
                    for (var i = 0; i < this.hiddenWordsArray.length; i++) {
                      if (this.hiddenWordsArray[i].includes('COUNT')) {
                        this.hiddenWordsArray[i] = this.hiddenWordsArray[i]
                          .replace('COUNT', '')
                          .replace('DISTINCT', '')
                          .replace('(', '')
                          .replace(')', '');
                      }
                      if (this.hiddenWordsArray[i].includes('MIN')) {
                        this.hiddenWordsArray[i] = this.hiddenWordsArray[i]
                          .replace('MIN', '')
                          .replace('(', '')
                          .replace(')', '');
                      }
                      if (this.hiddenWordsArray[i].includes('MAX')) {
                        this.hiddenWordsArray[i] = this.hiddenWordsArray[i]
                          .replace('MAX', '')
                          .replace('(', '')
                          .replace(')', '');
                      }
                      if (this.hiddenWordsArray[i].includes('SUM')) {
                        this.hiddenWordsArray[i] = this.hiddenWordsArray[i]
                          .replace('SUM', '')
                          .replace('(', '')
                          .replace(')', '');
                      }
                      if (this.hiddenWordsArray[i].includes('AVG')) {
                        this.hiddenWordsArray[i] = this.hiddenWordsArray[i]
                          .replace('AVG', '')
                          .replace('(', '')
                          .replace(')', '');
                      }
                    }
                  }
                }
              });

            this.http
              .post<any>(
                this.url.baseUrl + '/getaldataofatable',
                {
                  sqlQueryString:
                    'SELECT * FROM' + ' `' + table.table_name + '`',
                },
                { headers }
              )
              .subscribe((data) => {
                if (data.result == 'Empty Table') {
                  Swal.fire(
                    '',
                    'Το Τεστ για τον Πίνακα ' +
                      this.header_tale_name +
                      ' δεν είναι ακόμη έτοιμο καθώς δεν περιέχει δεδομένα ή SQL Ερωτήσεις!',
                    'error'
                  );
                  this.tableArrayName = [];
                  this.tableColumnsArray = [];
                  this.tableColumnsArray2 = [];
                  this.dataOfEachTableArray = [];
                  this.secondtableColumnsArray = [];
                  this.seconddataOfEachTableArray = [];
                  this.header_tale_name = '';
                  this.fillfieldsquestionsArray = [];
                  this.hideWordArray = [];
                  this.role = '';
                  this.secondTable = '';
                  this.questionid = '0';
                  this.questionidToNumber;
                  this.resultcolumnsArray = [];
                  this.hiddenWordsArray = [];
                  this.resultdataArray = [];
                  this.errorText = '';
                  this.correctAnswers = 0;
                  this.startTimer = false;
                  this.timer = 0;
                  this.converttimer;
                  this.load = false;
                  this.questionWithField = '';
                  this.heddenWords = '';
                  clearInterval(this.interval);
                  this.ngOnInit();
                } else {
                  this.dataOfEachTableArray = data.result[0];
                }
              });
          }
          this.router.navigate(['/questionsToTablesTrueOrFalse/0']);
        }
      });
  }

  next() {

    if(this.selection==undefined){
     return Swal.fire('', 'Επιλέξτε μία απάντηση', 'info');
    }
    console.log(this.selection);
    console.log(this.random);
    var wrong = false;

    if (this.selection.toString() == '1') {
      if (this.random == 1) {
        wrong = false;
      } else {
        wrong = true;
      }
    } else {
      if (this.random == 1) {
        wrong = true;
      } else {
        wrong = false;
      }
    }
    if (!wrong) {
      this.correctAnswers = this.correctAnswers + 1;
      Swal.fire({
        title: 'Σωστό',
        text: '',
        icon: 'success',
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonText: 'Συνέχεια',
      }).then((result) => {
        if (result.isConfirmed) {
          this.errorText = '';
          if (
            this.fillfieldsquestionsArray.length - 2 <
            this.questionidToNumber
          ) {
            clearInterval(this.interval);
            this.timer = 0;

            const headers = {
              'Content-Type': 'application/json; charset=UTF-8',
              Authorization: localStorage.getItem('token'),
            };
            const body = {
              rate:
                'Σωστές ' +
                this.correctAnswers +
                ' στις ' +
                this.fillfieldsquestionsArray.length,
              table_name: this.header_tale_name,
              time: this.converttimer,
              type_excersice: 'Σωστό-λάθος',
            };
            this.http
              .post<any>(
                this.url.baseUrl + 'addarate/' + localStorage.getItem('id'),
                body,
                { headers }
              )
              .subscribe((data) => {
                console.log(data);
                if (data.result == 'Rate added') {
                  Swal.fire(
                    '',
                    'Μόλις ολοκλήρωσες το Τεστ.' +
                      'Σωστές ' +
                      this.correctAnswers +
                      ' στις ' +
                      this.fillfieldsquestionsArray.length +
                      '.Το ποσοστό επιτυχίας σου καταχωρήθηκε!',
                    'success'
                  );
                  localStorage.setItem('insideFillFieldQuestionsTable', 'no');
                  localStorage.setItem(
                    'insideFillFieldQuestionsTableTrueOrFalse',
                    'no'
                  );
                  this.router.navigate(['/myscores']);
                } else {
                  Swal.fire(
                    'Ουπς...',
                    'Κάτι πήγε στραβά!Παρακαλώ προσπαθήστε αργότερα.',
                    'error'
                  );
                }
              });
          } else {
            this.selection = undefined;
            this.questionidToNumber = this.questionidToNumber + 1;
            this.random = this.randomInteger(1, 2);
            if (this.random == 1) {
              this.questionWithField = this.fillfieldsquestionsArray[
                this.questionidToNumber
              ].sql_query;
            } else {
              var nextQueryShows =
                (this.questionidToNumber+1) % this.fillfieldsquestionsArray.length;
              console.log('tyxaia');
              this.questionWithField = this.fillfieldsquestionsArray[
                nextQueryShows
              ].sql_query;
            }

            const headers = {
              'Content-Type': 'application/json; charset=UTF-8',
              Authorization: localStorage.getItem('token'),
            };
            const body = {
              sqlQueryString: this.fillfieldsquestionsArray[
                this.questionidToNumber
              ].sql_query,
            };
            this.http
              .post<any>(this.url.baseUrl + 'executesqlquery', body, {
                headers,
              })
              .subscribe((data) => {
                console.log(data);
                if (Array.isArray(data.result)) {
                  if (data.result.length == 0) {
                    this.errorText = 'Το ερώτημα επιστρέφει κενό πίνακα!';
                  } else {
                    this.resultcolumnsArray = Object.keys(data.result[0]);
                    this.resultdataArray = data.result;
                    this.hiddenWordsArray = [];

                    for (var i = 0; i < this.resultcolumnsArray.length; i++) {
                      this.hiddenWordsArray.push(this.resultcolumnsArray[i]);
                    }
                    for (var i = 0; i < this.hiddenWordsArray.length; i++) {
                      if (this.hiddenWordsArray[i].includes('COUNT')) {
                        this.hiddenWordsArray[i] = this.hiddenWordsArray[i]
                          .replace('COUNT', '')
                          .replace('DISTINCT', '')
                          .replace('(', '')
                          .replace(')', '');
                      }
                      if (this.hiddenWordsArray[i].includes('MIN')) {
                        this.hiddenWordsArray[i] = this.hiddenWordsArray[i]
                          .replace('MIN', '')
                          .replace('(', '')
                          .replace(')', '');
                      }
                      if (this.hiddenWordsArray[i].includes('MAX')) {
                        this.hiddenWordsArray[i] = this.hiddenWordsArray[i]
                          .replace('MAX', '')
                          .replace('(', '')
                          .replace(')', '');
                      }
                      if (this.hiddenWordsArray[i].includes('SUM')) {
                        this.hiddenWordsArray[i] = this.hiddenWordsArray[i]
                          .replace('SUM', '')
                          .replace('(', '')
                          .replace(')', '');
                      }
                      if (this.hiddenWordsArray[i].includes('AVG')) {
                        this.hiddenWordsArray[i] = this.hiddenWordsArray[i]
                          .replace('AVG', '')
                          .replace('(', '')
                          .replace(')', '');
                      }
                    }
                  }
                }
              });
            this.router.navigate([
              '/questionsToTablesTrueOrFalse/' + this.questionidToNumber,
            ]);
          }
        }
      });
    } else {
      Swal.fire({
        title: 'Λάθος',
        icon: 'error',
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonText: 'Συνέχεια',
      }).then((result) => {
        if (result.isConfirmed) {
          this.errorText = '';
          if (
            this.fillfieldsquestionsArray.length - 2 <
            this.questionidToNumber
          ) {
            clearInterval(this.interval);
            this.timer = 0;

            const headers = {
              'Content-Type': 'application/json; charset=UTF-8',
              Authorization: localStorage.getItem('token'),
            };
            const body = {
              rate:
                'Σωστές ' +
                this.correctAnswers +
                ' στις ' +
                this.fillfieldsquestionsArray.length,
              table_name: this.header_tale_name,
              time: this.converttimer,
              type_excersice: 'Σωστό-λάθος',
            };
            this.http
              .post<any>(
                this.url.baseUrl + 'addarate/' + localStorage.getItem('id'),
                body,
                { headers }
              )
              .subscribe((data) => {
                console.log(data);
                if (data.result == 'Rate added') {
                  Swal.fire(
                    '',
                    'Μόλις ολοκλήρωσες το Τεστ.' +
                      'Σωστές ' +
                      this.correctAnswers +
                      ' στις ' +
                      this.fillfieldsquestionsArray.length +
                      '.Το ποσοστό επιτυχίας σου καταχωρήθηκε!',
                    'success'
                  );
                  localStorage.setItem('insideFillFieldQuestionsTable', 'no');
                  localStorage.setItem(
                    'insideFillFieldQuestionsTableTrueOrFalse',
                    'no'
                  );
                  this.router.navigate(['/myscores']);
                } else {
                  Swal.fire(
                    'Ουπς...',
                    'Κάτι πήγε στραβά!Παρακαλώ προσπαθήστε αργότερα.',
                    'error'
                  );
                }
              });
          } else {
            this.selection = undefined;
            this.questionidToNumber = this.questionidToNumber + 1;
            this.random = this.randomInteger(1, 2);
            if (this.random == 1) {
              this.questionWithField = this.fillfieldsquestionsArray[
                this.questionidToNumber
              ].sql_query;
            } else {
              var nextQueryShows =
              (this.questionidToNumber+1) % this.fillfieldsquestionsArray.length;
              console.log('tyxaia');
              this.questionWithField = this.fillfieldsquestionsArray[
                nextQueryShows
              ].sql_query;
            }

            const headers = {
              'Content-Type': 'application/json; charset=UTF-8',
              Authorization: localStorage.getItem('token'),
            };
            const body = {
              sqlQueryString: this.fillfieldsquestionsArray[
                this.questionidToNumber
              ].sql_query,
            };
            this.http
              .post<any>(this.url.baseUrl + 'executesqlquery', body, {
                headers,
              })
              .subscribe((data) => {
                console.log(data);
                if (Array.isArray(data.result)) {
                  if (data.result.length == 0) {
                    this.errorText = 'Το ερώτημα επιστρέφει κενό πίνακα!';
                  } else {
                    this.resultcolumnsArray = Object.keys(data.result[0]);
                    this.resultdataArray = data.result;
                    this.hiddenWordsArray = [];

                    for (var i = 0; i < this.resultcolumnsArray.length; i++) {
                      this.hiddenWordsArray.push(this.resultcolumnsArray[i]);
                    }
                    for (var i = 0; i < this.hiddenWordsArray.length; i++) {
                      if (this.hiddenWordsArray[i].includes('COUNT')) {
                        this.hiddenWordsArray[i] = this.hiddenWordsArray[i]
                          .replace('COUNT', '')
                          .replace('DISTINCT', '')
                          .replace('(', '')
                          .replace(')', '');
                      }
                      if (this.hiddenWordsArray[i].includes('MIN')) {
                        this.hiddenWordsArray[i] = this.hiddenWordsArray[i]
                          .replace('MIN', '')
                          .replace('(', '')
                          .replace(')', '');
                      }
                      if (this.hiddenWordsArray[i].includes('MAX')) {
                        this.hiddenWordsArray[i] = this.hiddenWordsArray[i]
                          .replace('MAX', '')
                          .replace('(', '')
                          .replace(')', '');
                      }
                      if (this.hiddenWordsArray[i].includes('SUM')) {
                        this.hiddenWordsArray[i] = this.hiddenWordsArray[i]
                          .replace('SUM', '')
                          .replace('(', '')
                          .replace(')', '');
                      }
                      if (this.hiddenWordsArray[i].includes('AVG')) {
                        this.hiddenWordsArray[i] = this.hiddenWordsArray[i]
                          .replace('AVG', '')
                          .replace('(', '')
                          .replace(')', '');
                      }
                    }
                  }
                }
              });
            this.router.navigate([
              '/questionsToTablesTrueOrFalse/' + this.questionidToNumber,
            ]);
          }
        }
      });
    }
  }
  ngOnDestroy() {
    clearInterval(this.interval);
  }
  randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
