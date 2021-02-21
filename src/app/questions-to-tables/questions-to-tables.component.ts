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
        if (data.result) {
          this.spinner.hide();
          for (var i = 0; i < data.result.length; i++) {
            this.tableArrayName.push(data.result[i]);
          }
          console.log(this.tableArrayName);
        } else {
          Swal.fire('', 'Δεν υπάρχουν Πίνακες!', 'error');
        }
      });
  }

  async eachTableColumns(table, name) {
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
    var text = this.textfield;
    console.log(this.fillfieldsquestionsArray[this.questionid].sql_query);
    console.log(text);
    if (
      text.toLowerCase() ==
      this.fillfieldsquestionsArray[this.questionid].sql_query.toLowerCase()
    ) {
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
            Swal.fire(
              '',
              'Οι ερωτήσεις σε αυτόν τον Πίνακα τελείωσαν!',
              'info'
            );
            this.tableArrayName = [];
            this.tableColumnsArray = [];
            this.tableColumnsArray2 = [];
            this.dataOfEachTableArray = [];
            this.onlyColumnsArray = [];
            this.header_tale_name = '';
            this.fillfieldsquestionsArray = [];
            this.role = '';
            this.questionid = '0';
            this.questionidToNumber;
            this.textfield = '';
            this.resultcolumnsArray = [];
            this.resultdataArray = [];
            this.errorText = '';
            this.ngOnInit();
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
            Swal.fire(
              '',
              'Οι ερωτήσεις σε αυτόν τον Πίνακα τελείωσαν!',
              'info'
            );
            this.tableArrayName = [];
            this.tableColumnsArray = [];
            this.tableColumnsArray2 = [];
            this.dataOfEachTableArray = [];
            this.onlyColumnsArray = [];
            this.header_tale_name = '';
            this.fillfieldsquestionsArray = [];
            this.role = '';
            this.questionid = '0';
            this.questionidToNumber;
            this.textfield = '';
            this.resultcolumnsArray = [];
            this.resultdataArray = [];
            this.errorText = '';
            this.ngOnInit();
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
}
