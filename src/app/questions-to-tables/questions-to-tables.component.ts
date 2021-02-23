import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppComponent } from '../app.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-questions-to-tables',
  templateUrl: './questions-to-tables.component.html',
  styleUrls: ['./questions-to-tables.component.css'],
})
export class QuestionsToTablesComponent implements OnInit {
  tableArrayName = [];
  tableColumnsArray = [];
  tableColumnsArray2 = [];
  dataOfEachTableArray = [];
  onlyColumnsArray = [];

  secondtableColumnsArray = [];
  seconddataOfEachTableArray = [];

  header_tale_name = '';
  fillfieldsquestionsArray = [];
  role = '';

  secondTable = '';
  questionid = '0';
  questionidToNumber;
  textfield = '';

  resultcolumnsArray = [];
  resultdataArray = [];
  errorText = '';

  correctAnswers = 0;
  startTimer = false;

  timer: number = 0;
  converttimer;
  interval;

  load=false;
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
    this.onlyColumnsArray = [];
    this.tableColumnsArray = table.temparray;
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

    for (var i = 0; i < table.temparray.length; i++) {
      this.onlyColumnsArray.push(table.temparray[i].COLUMN_NAME);
    }

    this.http
      .post<any>(
        this.url.baseUrl + 'getallsqlqueriesfromspecifictable',
        { tablename: name },
        { headers }
      )
      .subscribe((data) => {
        this.load=true
        console.log(data.result);
        if (data.result) {
          this.fillfieldsquestionsArray = data.result.sql_random_queries;
          console.log(this.fillfieldsquestionsArray);
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
                }
              }
            });
        }
      });

    this.http
      .post<any>(
        this.url.baseUrl + '/getaldataofatable',
        { sqlQueryString: 'SELECT * FROM' + ' `' + table.table_name + '`' },
        { headers }
      )
      .subscribe((data) => {
        if (data.result == 'Empty Table') {
          Swal.fire('', 'Άδεια Κελιά!', 'warning');
        } else {
          this.dataOfEachTableArray = data.result[0];
          console.log(this.dataOfEachTableArray);
        }
      });
    this.router.navigate(['/questionsToTables/0']);
  }

  next() {
    //na stelnw to score se enan neo pinaka sotn api pou th adeinei poses stis poses kai se pion pinaka.
    //Na dw ti tha kanw me to pws tha sigkrinw tis apantiseis kai ti tha krivw.
    //Kai na ksanaftiaksw ta automata sql erwtimata na einia pio statika gia na petixainoun kai oi erwtiseis.

    var text = this.textfield;
    console.log(this.fillfieldsquestionsArray[this.questionid].sql_query);
    console.log(text);
    if (
      text.toLowerCase() ==
      this.fillfieldsquestionsArray[this.questionid].sql_query.toLowerCase()
    ) {
      this.correctAnswers = this.correctAnswers + 1;
      Swal.fire({
        title: '',
        text: 'Σωστό',
        icon: 'success',
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonText: 'OK!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.errorText = '';
          if (
            this.fillfieldsquestionsArray.length - 2 <
            this.questionidToNumber
          ) {
            console.log(this.converttimer);
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
            this.textfield = '';
            this.questionidToNumber = this.questionidToNumber + 1;
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
                  }
                }
              });
            this.router.navigate([
              '/questionsToTables/' + this.questionidToNumber,
            ]);
          }
        }
      });
    } else {
      Swal.fire({
        title: '',
        text:
          'Λάθος.Η σωστή απάντηση είναι: ' +
          this.fillfieldsquestionsArray[this.questionid].sql_query,
        icon: 'error',
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonText: 'OK!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.errorText = '';
          if (
            this.fillfieldsquestionsArray.length - 2 <
            this.questionidToNumber
          ) {
            console.log(this.converttimer);
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
            this.textfield = '';
            this.questionidToNumber = this.questionidToNumber + 1;
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
                  }
                }
              });
            this.router.navigate([
              '/questionsToTables/' + this.questionidToNumber,
            ]);
          }
        }
      });
    }
  }
  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
