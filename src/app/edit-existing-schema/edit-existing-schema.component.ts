import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogAddSqlQueryComponent } from '../dialog-add-sql-query/dialog-add-sql-query.component';
import { DialogShowQueryResultsComponent } from '../dialog-show-query-results/dialog-show-query-results.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogSqlQueryTableComponent } from '../dialog-sql-query-table/dialog-sql-query-table.component';
import { Router } from '@angular/router';
import { DialogSqlQueryTrueOrFalseTableComponent } from '../dialog-sql-query-true-or-false-table/dialog-sql-query-true-or-false-table.component';

@Component({
  selector: 'app-edit-existing-schema',
  templateUrl: './edit-existing-schema.component.html',
  styleUrls: ['./edit-existing-schema.component.css'],
})
export class EditExistingSchemaComponent implements OnInit {
  tableArrayName = [];
  tableColumnsArray = [];
  tableColumnsArray2 = [];
  tablesOnlyName = [];
  dataOfEachTableArray = [];
  onlyColumnsArray = [];
  header_tale_name = '';
  questionsOfEachTableArray = [];
  questionsTrueOrFalseOfEachTableArray = [];
  statictable;
  statictablename = '';
  role = '';
  unstableColumnsArrayNames = [];
  foreignkeyColumn = '';
  constructor(
    private router: Router,
    private http: HttpClient,
    private url: AppComponent,
    private matDialog: MatDialog,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('token') == null) {
      this.router.navigate(['']);
    }
    this.tablesOnlyName = [];
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
            this.tablesOnlyName.push(data.result[i].table_name);
          }
          console.log(this.tablesOnlyName);
          console.log(this.tableArrayName);
        } else {
          Swal.fire(
            '',
            'Δεν υπάρχουν Πίνακες!Παρακαλώ Δημιουργήστε έναν.',
            'error'
          );
        }
      });
  }

  eachTableColumns(table, name) {
    this;
    this.statictablename = name;
    this.statictable = table;
    this.header_tale_name = name;
    this.tableColumnsArray = [];
    this.tableColumnsArray2 = [];
    this.dataOfEachTableArray = [];
    this.onlyColumnsArray = [];
    this.foreignkeyColumn = '';
    console.log(table);

    this.tableColumnsArray = table.temparray;
    this.tableColumnsArray2 = table.temparray2;
    for (var i = 0; i < table.temparray.length; i++) {
      this.onlyColumnsArray.push(table.temparray[i].COLUMN_NAME);
    }
    for (var j = 0; j < this.onlyColumnsArray.length; j++) {
      for (var i = 0; i < this.tableColumnsArray2.length; i++) {
        if (
          this.tableColumnsArray2[i].OTHER_VALUES.COLUMN_NAME ==
            this.onlyColumnsArray[j] &&
          this.tableColumnsArray2[i].OTHER_VALUES.REFERENCED_COLUMN_NAME != null
        ) {
          this.foreignkeyColumn = this.onlyColumnsArray[j];
        }
      }
    }
    console.log(this.foreignkeyColumn);
    const headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: localStorage.getItem('token'),
    };
    this.http
      .post<any>(
        this.url.baseUrl + 'getallsqlqueriesfromspecifictable',
        { tablename: name },
        { headers }
      )
      .subscribe((data) => {
        console.log(data.result);
        if (data.result) {
          this.questionsOfEachTableArray = data.result.sql_random_queries;
        }
      });

    this.http
      .post<any>(
        this.url.baseUrl + 'getallsqlqueriestrueorfalsefromspecifictable',
        { tablename: name },
        { headers }
      )
      .subscribe((data) => {
        console.log(data.result);
        if (data.result) {
          this.questionsTrueOrFalseOfEachTableArray =
            data.result.sql_random_queries_true_or_falses;
        }
      });

    console.log(this.onlyColumnsArray);
    this.http
      .post<any>(
        this.url.baseUrl + '/getaldataofatable',
        { sqlQueryString: 'SELECT * FROM' + ' `' + table.table_name + '`' },
        { headers }
      )
      .subscribe((data) => {
        console.log(data.result[0]);
        if (data.result == 'Empty Table') {
          Swal.fire('', 'Άδεια Κελιά!', 'warning');
        } else {
          this.dataOfEachTableArray = data.result[0];
          console.log(this.dataOfEachTableArray);
        }
      });
  }

  writeQueryOnHisOwn(defaultQuery?) {
    var title1 = '';
    if (this.role == 'student') {
      title1 =
        'Διατυπώστε οποιοδήποτε SQL SELECT ερώτημα για να εκτελεστεί στον Πίνακα ' +
        this.statictablename;
    } else {
      title1 =
        'Διατυπώστε οποιοδήποτε SQL ερώτημα για να εκτελεστεί στον Πίνακα ' +
        this.statictablename;
    }
    Swal.fire({
      title: title1,
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      width: 1000,
      inputValue: defaultQuery,
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: 'Εκτέλεση',
      cancelButtonText: 'Ακύρωση',
      showLoaderOnConfirm: true,
      preConfirm: (query) => {
        if (query) {
          if (this.role == 'student') {
            if (
              query.toLowerCase().includes('delete') ||
              query.toLowerCase().includes('drop') ||
              query.toLowerCase().includes('alter') ||
              query.toLowerCase().includes('insert')
            ) {
              return Swal.fire(
                '',
                'Μπορείτε να εκετελέσετε μόνο SELECT SQL Ερώτημα!',
                'error'
              );
            }
          }
          if (
            query.toLowerCase().includes('excersice_tables') ||
            query.toLowerCase().includes('sql_random_queries') ||
            query.toLowerCase().includes('sql_random_queries_true_or_false') ||
            query.toLowerCase().includes('fill_fields_questions') ||
            query.toLowerCase().includes('user_table') ||
            query.toLowerCase().includes('sql_questions') ||
            query.toLowerCase().includes('score_table') ||
            query.toLowerCase().includes('success_rate')
          ) {
            return Swal.fire(
              '',
              'Δεν μπορείτε να εκτελέσετε κάποιο SQL ερώτημα σε αυτόν τον πίνακα!',
              'error'
            );
          }
          if (this.role == 'student') {
            if (!query.toLowerCase().includes(this.statictablename)) {
              return Swal.fire(
                'Αδυναμία εκτέλεσης!',
                'Το SQL Ερώτημα πρέπει να αναφέρεται στον συγκεκριμένο πίνακα!',
                'info'
              );
            }
            for (
              var i = 0;
              i < this.questionsTrueOrFalseOfEachTableArray.length;
              i++
            ) {
              if (
                this.questionsTrueOrFalseOfEachTableArray[
                  i
                ].sql_query_true_or_false.toLowerCase() === query.toLowerCase()
              ) {
                return Swal.fire(
                  'Αδυναμία εκτέλεσης!',
                  'Το SQL Ερώτημα υπάρχει στο Τεστ τύπου σωστό-λάθος!',
                  'info'
                );
              }
            }
          }

          const headers = {
            'Content-Type': 'application/json; charset=UTF-8',
            Authorization: localStorage.getItem('token'),
          };
          const body = {
            sqlQueryString: query,
          };
          this.http
            .post<any>(this.url.baseUrl + 'executesqlquerystudent', body, {
              headers,
            })
            .subscribe((data) => {
              console.log(data);
              if (Object.keys(data).length === 0) {
                this.tableArrayName = [];
                this.tableColumnsArray = [];
                this.tableColumnsArray2 = [];
                this.dataOfEachTableArray = [];
                this.onlyColumnsArray = [];
                this.header_tale_name = '';
                this.questionsOfEachTableArray = [];
                this.questionsTrueOrFalseOfEachTableArray = [];

                Swal.fire('', 'Το SQL Ερώτημα εκτελέστηκε', 'success');
                this.ngOnInit();
                this.eachTableColumns(this.statictable, this.statictablename);
              } else if (data.error) {
                Swal.fire({
                  icon: 'error',
                  title: 'Error!',
                  allowOutsideClick: false,
                  text: data.error.original.sqlMessage,
                  confirmButtonText: 'OK',
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.writeQueryOnHisOwn(query);
                  }
                });
              } else if (data.result) {
                if (data.result.careful) {
                  return Swal.fire(
                    'Αδυναμία εκτέλεσης!',
                    'Το SQL Ερώτημα υπάρχει στο Τεστ τύπου σωστό-λάθος!',
                    'info'
                  );
                }
                if (Array.isArray(data.result)) {
                  if (data.result.length == 0) {
                    Swal.fire(
                      'Αποτέλεσμα!',
                      'Το SQL Ερώτημα επιστέφει έναν άδειο Πίνακα!',
                      'info'
                    );
                  } else {
                    var columnsArray = [];
                    var dataArray = [];
                    columnsArray = Object.keys(data.result[0]);
                    dataArray = data.result;
                    const dialogConfig = new MatDialogConfig();
                    dialogConfig.data = {
                      columnsArray: columnsArray,
                      dataArray: dataArray,
                      query: query,
                    };
                    let dialog = this.matDialog.open(
                      DialogShowQueryResultsComponent,
                      dialogConfig
                    );
                    dialog.afterClosed().subscribe((result) => {});
                  }
                } else if ((data.result.serverStatus = 2)) {
                  this.tableArrayName = [];
                  this.tableColumnsArray = [];
                  this.tableColumnsArray2 = [];
                  this.dataOfEachTableArray = [];
                  this.onlyColumnsArray = [];
                  this.header_tale_name = '';
                  this.questionsOfEachTableArray = [];
                  this.questionsTrueOrFalseOfEachTableArray = [];

                  Swal.fire('', 'Το SQL Ερώτημα εκτελέστηκε', 'success');
                  this.ngOnInit();
                  this.eachTableColumns(this.statictable, this.statictablename);
                } else {
                  Swal.fire(
                    '',
                    'Ακόμη δεν υπάρχουν διαθέσιμα αποτελέσματα!',
                    'warning'
                  );
                }
              } else {
                this.tableArrayName = [];
                this.tableColumnsArray = [];
                this.tableColumnsArray2 = [];
                this.dataOfEachTableArray = [];
                this.onlyColumnsArray = [];
                this.header_tale_name = '';
                this.questionsOfEachTableArray = [];
                this.questionsTrueOrFalseOfEachTableArray = [];

                Swal.fire('', 'Το SQL Ερώτημα εκτελέστηκε', 'success');
                this.ngOnInit();
                this.eachTableColumns(this.statictable, this.statictablename);
              }
            });
        } else {
          Swal.fire('', 'Υπάρχουν κενά πεδία!', 'error');
        }
      },
    });
  }
  addValuesToTable() {
    console.log(this.onlyColumnsArray);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      tableColumnsArray: this.tableColumnsArray,
      tableColumnsArray2: this.tableColumnsArray2,
      tablename: this.statictable,
    };
    let dialog = this.matDialog.open(DialogAddSqlQueryComponent, dialogConfig);
    dialog.afterClosed().subscribe((result) => {
      this.tableArrayName = [];
      this.tableColumnsArray = [];
      this.tableColumnsArray2 = [];
      this.dataOfEachTableArray = [];
      this.onlyColumnsArray = [];
      this.header_tale_name = '';
      this.questionsOfEachTableArray = [];
      this.questionsTrueOrFalseOfEachTableArray = [];

      this.ngOnInit();
      this.eachTableColumns(this.statictable, this.statictablename);
    });
  }

  async connect2Tables() {
    this.unstableColumnsArrayNames = [];

    await Swal.fire({
      title: 'Επιλέξτε τον άλλο Πίνακα για την σύνδεση μεταξύ τους...',
      input: 'select',
      confirmButtonText: 'Συνέχεια',
      cancelButtonText: 'Ακύρωση',
      width: 1000,
      inputOptions: {
        Πίνακες: this.tablesOnlyName,
      },
      showCancelButton: true,
      inputValidator: (i) => {
        return new Promise((resolve) => {
          console.log(this.tablesOnlyName[i]);
          console.log(this.tableArrayName[i]);

          for (var j = 0; j < this.tableArrayName[i].temparray.length; j++) {
            this.unstableColumnsArrayNames.push(
              this.tableArrayName[i].temparray[j].COLUMN_NAME
            );
          }
          console.log(this.unstableColumnsArrayNames);
          Swal.fire({
            title:
              'Σε πιο κλειδί αναφέρεστε από τον Πίνακα ' +
              this.tablesOnlyName[i] +
              ';',
            input: 'select',
            cancelButtonText: 'Ακύρωση',
            width: 1000,
            inputOptions: {
              Στήλες: this.unstableColumnsArrayNames,
            },
            confirmButtonText: 'Συνέχεια',
            showCancelButton: true,
            inputValidator: (position) => {
              return new Promise((resolve) => {
                console.log(this.unstableColumnsArrayNames[position]);

                Swal.fire({
                  title:
                    'Ορίστε πιο θα είναι το ξένο κλειδί από τον Πίνακα ' +
                    this.statictablename +
                    '...',
                  cancelButtonText: 'Ακύρωση',
                  input: 'select',
                  width: 1000,
                  inputOptions: {
                    Στήλες: this.onlyColumnsArray,
                  },
                  showCancelButton: true,
                  confirmButtonText: 'Συνέχεια',
                  showLoaderOnConfirm: true,
                  inputValidator: (position2) => {
                    return new Promise(async (resolve) => {
                      console.log(this.onlyColumnsArray[position2]);

                      const { value: formValues } = await Swal.fire({
                        width: 1000,
                        title:
                          'Καταχωρήστε την συμπεριφορά στις μεταβολές των δεδομένων',
                        html:
                          '<label>ON DELETE</label>' +
                          '<input id="swal-input1" class="swal2-input" placeholder="NO ACTION,RESTRICT,CASCADE,SET NULL">' +
                          '<label>ON UPDATE</label>' +
                          '<input id="swal-input2" class="swal2-input" placeholder="NO ACTION,RESTRICT,CASCADE,SET NULL">',
                        focusConfirm: false,
                        cancelButtonText: 'Ακύρωση',
                        confirmButtonText: 'Ολοκλήρωση',
                        preConfirm: () => {
                          return [
                            (<HTMLInputElement>(
                              document.getElementById('swal-input1')
                            )).value,
                            (<HTMLInputElement>(
                              document.getElementById('swal-input2')
                            )).value,
                          ];
                        },
                      });
                      if (formValues) {
                        const headers = {
                          'Content-Type': 'application/json; charset=UTF-8',
                          Authorization: localStorage.getItem('token'),
                        };
                        const body = {
                          sqlQueryString:
                            'ALTER TABLE diplwmatiki.' +
                            this.tablesOnlyName[i] +
                            ' ADD INDEX ' +
                            this.unstableColumnsArrayNames[position] +
                            ' (' +
                            this.unstableColumnsArrayNames[position] +
                            ' ASC) VISIBLE; ',
                        };
                        this.http
                          .post<any>(
                            this.url.baseUrl + 'executesqlquery',
                            body,
                            {
                              headers,
                            }
                          )
                          .subscribe((data) => {
                            const body1 = {
                              sqlQueryString:
                                ' ALTER TABLE diplwmatiki.' +
                                this.statictablename +
                                ' ADD CONSTRAINT ' +
                                this.onlyColumnsArray[position2] +
                                ' FOREIGN KEY (' +
                                this.onlyColumnsArray[position2] +
                                ') REFERENCES diplwmatiki.' +
                                this.tablesOnlyName[i] +
                                '(' +
                                this.unstableColumnsArrayNames[position] +
                                ')  ON DELETE ' +
                                formValues[0] +
                                ' ON UPDATE ' +
                                formValues[1],
                            };
                            console.log(data);
                            this.http
                              .post<any>(
                                this.url.baseUrl + 'executesqlquery',
                                body1,
                                {
                                  headers,
                                }
                              )
                              .subscribe((data) => {
                                console.log(data);
                                if (Object.keys(data).length === 0) {
                                  Swal.fire({
                                    title: '',
                                    text: 'Η προσθήκη της ιδιότητας του ξένου κλειδιού καταχωρήθηκε!!',
                                    icon: 'success',
                                    showCancelButton: false,
                                    confirmButtonColor: '#3085d6',
                                    confirmButtonText: 'Εντάξει',
                                  }).then((result) => {
                                    if (result.isConfirmed) {
                                      this.createSqlQueries(
                                        this.tablesOnlyName[i],
                                        this.unstableColumnsArrayNames[
                                          position
                                        ],
                                        this.unstableColumnsArrayNames,
                                        this.onlyColumnsArray[position2],
                                        this.statictablename,
                                        this.onlyColumnsArray
                                      );
                                    } else {
                                      this.createSqlQueries(
                                        this.tablesOnlyName[i],
                                        this.unstableColumnsArrayNames[
                                          position
                                        ],
                                        this.unstableColumnsArrayNames,
                                        this.onlyColumnsArray[position2],
                                        this.statictablename,
                                        this.onlyColumnsArray
                                      );
                                    }
                                  });
                                } else if (data.error) {
                                  Swal.fire({
                                    icon: 'error',
                                    title: 'Error!',
                                    allowOutsideClick: false,
                                    text: data.error.original.sqlMessage,
                                    confirmButtonText: 'OK',
                                  });
                                } else if (data.result) {
                                  if ((data.result.serverStatus = 2)) {
                                    Swal.fire({
                                      title: '',
                                      text: 'Η προσθήκη της ιδιότητας του ξένου κλειδιού καταχωρήθηκε!',
                                      icon: 'success',
                                      showCancelButton: false,
                                      confirmButtonColor: '#3085d6',
                                      confirmButtonText: 'Εντάξει',
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                        this.createSqlQueries(
                                          this.tablesOnlyName[i],
                                          this.unstableColumnsArrayNames[
                                            position
                                          ],
                                          this.unstableColumnsArrayNames,
                                          this.onlyColumnsArray[position2],
                                          this.statictablename,
                                          this.onlyColumnsArray
                                        );
                                      }
                                    });
                                  } else {
                                    Swal.fire(
                                      '',
                                      'Ακόμη δεν υπάρχουν διαθέσιμα αποτελέσματα!',
                                      'warning'
                                    );
                                  }
                                }
                              });
                          });
                      }
                    });
                  },
                });
              });
            },
          });
        });
      },
    });
  }

  createSqlQueries(
    secondTableName,
    secondTableConnectionKey,
    secondTableColumnsArray,
    staticTableKey,
    staticTableName,
    staticTableColumnsArray
  ) {
    console.log(
      secondTableName,
      secondTableConnectionKey,
      secondTableColumnsArray,
      staticTableKey,
      staticTableName,
      staticTableColumnsArray
    );
    Swal.fire({
      title:
        ' Θέλετε να παραχθούν SQL Ερωτήματα ανάμεσα στους συνδεδεμένους Πίνακες;\n\n*Τα SQL Ερωτήματα θα εμφανίζονται στους Εκπαιδευόμενους στις κατηγορίες "Τεστ: Ερωτήσεις Συμπλήρωσης-Κενού σε Πίνακες" και "Τεστ:Ερωτήσεις Σωστού-Λάθους σε Πίνακες".  ',
      showDenyButton: true,
      allowOutsideClick: false,
      icon: 'success',
      confirmButtonText: `Ναι`,
      denyButtonText: `Όχι`,
    }).then((result) => {
      if (result.isConfirmed) {
        var staticrand=this.randomNumber(10)
        var static2rand=this.randomNumber(10)

        var arrayOfRandomSqlQueries = [
          // QUESTION 1
          'SELECT ' +
            secondTableName +
            '.' +
            secondTableConnectionKey +
            ', ' +
            secondTableName +
            '.' +
            secondTableColumnsArray[1 % secondTableColumnsArray.length] +
            ', ' +
            staticTableName +
            '.' +
            staticTableColumnsArray[1 % staticTableColumnsArray.length] +
            ', ' +
            staticTableName +
            '.' +
            staticTableColumnsArray[2 % staticTableColumnsArray.length] +
            ' FROM ' +
            secondTableName +
            ', ' +
            staticTableName +
            ' WHERE ' +
            secondTableName +
            '.' +
            secondTableConnectionKey +
            '=' +
            staticTableName +
            '.' +
            staticTableKey,
          // QUESTION 2
          'SELECT ' +
            secondTableName +
            '.' +
            secondTableConnectionKey +
            ', ' +
            secondTableName +
            '.' +
            secondTableColumnsArray[1 % secondTableColumnsArray.length] +
            ', ' +
            staticTableName +
            '.' +
            staticTableColumnsArray[1 % staticTableColumnsArray.length] +
            ' FROM ' +
            secondTableName +
            ' INNER JOIN ' +
            staticTableName +
            ' ON ' +
            secondTableName +
            '.' +
            secondTableConnectionKey +
            '=' +
            staticTableName +
            '.' +
            staticTableKey,
          // QUESTION 3
          'SELECT ' +
            secondTableName +
            '.' +
            secondTableColumnsArray[1 % secondTableColumnsArray.length] +
            ', ' +
            staticTableName +
            '.' +
            staticTableKey +
            ' FROM ' +
            secondTableName +
            ' LEFT JOIN ' +
            staticTableName +
            ' ON ' +
            secondTableName +
            '.' +
            secondTableConnectionKey +
            '=' +
            staticTableName +
            '.' +
            staticTableKey +
            ' ORDER BY ' +
            secondTableName +
            '.' +
            secondTableColumnsArray[1 % secondTableColumnsArray.length],
          // QUESTION 4
          'SELECT ' +
            secondTableName +
            '.' +
            secondTableConnectionKey +
            ', ' +
            staticTableName +
            '.' +
            staticTableColumnsArray[1 % staticTableColumnsArray.length] +
            ', ' +
            staticTableName +
            '.' +
            staticTableColumnsArray[2 % staticTableColumnsArray.length] +
            ' FROM ' +
            secondTableName +
            ' RIGHT JOIN ' +
            staticTableName +
            ' ON ' +
            secondTableName +
            '.' +
            secondTableConnectionKey +
            '=' +
            staticTableName +
            '.' +
            staticTableKey +
            ' ORDER BY ' +
            secondTableName +
            '.' +
            secondTableConnectionKey +
            ' DESC',
          // QUESTION 5
          'SELECT ' +
            secondTableName +
            '.' +
            secondTableConnectionKey +
            ', ' +
            secondTableName +
            '.' +
            secondTableColumnsArray[1 % secondTableColumnsArray.length] +
            ', ' +
            staticTableName +
            '.' +
            staticTableColumnsArray[1 % staticTableColumnsArray.length] +
            ' FROM ' +
            secondTableName +
            ' INNER JOIN ' +
            staticTableName +
            ' ON ' +
            secondTableName +
            '.' +
            secondTableConnectionKey +
            '=' +
            staticTableName +
            '.' +
            staticTableKey +
            ' WHERE ' +
            secondTableName +
            '.' +
            secondTableConnectionKey +
            '>'+this.randomNumber(5),
          // QUESTION 6
          'SELECT * FROM ' + staticTableName + ' CROSS JOIN ' + secondTableName,
          // QUESTION 7
          'SELECT ' +
            secondTableColumnsArray[this.randomNumber(10) % secondTableColumnsArray.length] +
            ' FROM ' +
            secondTableName +
            ' UNION SELECT ' +
            staticTableColumnsArray[this.randomNumber(10) % staticTableColumnsArray.length] +
            ' FROM ' +
            staticTableName,
          // QUESTION 8
          'SELECT ' +
            secondTableColumnsArray[this.randomNumber(10) % secondTableColumnsArray.length] +
            ' FROM ' +
            secondTableName +
            ' WHERE ' +
            secondTableConnectionKey +
            ' = ANY ( SELECT ' +
            staticTableKey +
            ' FROM ' +
            staticTableName +
            ' WHERE ' +
            staticTableKey +
            '>'+this.randomNumber(10)+' )',
          // QUESTION 9
          'SELECT ' +
            secondTableColumnsArray[this.randomNumber(10) % secondTableColumnsArray.length] +
            ' FROM ' +
            secondTableName +
            ' WHERE ' +
            secondTableConnectionKey +
            ' = ALL ( SELECT ' +
            staticTableKey +
            ' FROM ' +
            staticTableName +
            ' WHERE ' +
            staticTableKey +
            '='+this.randomNumber(10)+' )',
          // QUESTION 10
          'SELECT ' +
            secondTableColumnsArray[this.randomNumber(10) % secondTableColumnsArray.length] +
            ' FROM ' +
            secondTableName +
            ' WHERE ' +
            secondTableConnectionKey +
            ' IN ( SELECT ' +
            staticTableKey +
            ' FROM ' +
            staticTableName +
            ' WHERE ' +
            staticTableKey +
            '>'+this.randomNumber(10)+')',
        ];
        var hiddenWordsArray = [
          // QUESTION 1
          secondTableName + ',' + secondTableConnectionKey + ',=',
          // QUESTION 2
          'INNER,JOIN',
          // QUESTION 3
          'LEFT,ORDER BY',
          // QUESTION 4
          'RIGHT,DESC',
          // QUESTION 5
          'WHERE,>',
          // QUESTION 6
          'CROSS',
          // QUESTION 7
          'UNION',
          // QUESTION 8
          'ANY',
          // QUESTION 9
          'ALL',
          // QUESTION 10
          'IN',
        ];
        const headers = {
          'Content-Type': 'application/json; charset=UTF-8',
          Authorization: localStorage.getItem('token'),
        };
        this.http
          .post<any>(
            this.url.baseUrl + 'addarrayofqueries',
            {
              queriesArray: arrayOfRandomSqlQueries,
              hiddenWordsArray: hiddenWordsArray,
              table_name: staticTableName,
            },
            { headers }
          )
          .subscribe((data) => {
            console.log(data);
            if (data.result == 'Sql Queries successfully created!') {
              Swal.fire(
                'Τα SQL Ερωτήματα καταχωρήθηκαν επιτυχώς!',
                '',
                'success'
              );

              /*  secondTableName +
            '.' +
            secondTableColumnsArray[1 % secondTableColumnsArray.length] +*/

              var arrayOfRandomSqlQueriesTrueOrFalse = [
                // QUESTION 1
                'SELECT ' +
                  secondTableName +
                  '.' +
                  secondTableColumnsArray[1 % secondTableColumnsArray.length] +
                  ', ' +
                  staticTableName +
                  '.' +
                  staticTableColumnsArray[1 % staticTableColumnsArray.length] +
                  ', ' +
                  staticTableName +
                  '.' +
                  staticTableColumnsArray[2 % staticTableColumnsArray.length] +
                  ' FROM ' +
                  secondTableName +
                  ' INNER JOIN ' +
                  staticTableName +
                  ' ON ' +
                  secondTableName +
                  '.' +
                  secondTableConnectionKey +
                  '=' +
                  staticTableName +
                  '.' +
                  staticTableKey +
                  ' ORDER BY ' +
                  secondTableName +
                  '.' +
                  secondTableConnectionKey +
                  ' DESC',
                // QUESTION 2
                'SELECT ' +
                  secondTableName +
                  '.' +
                  secondTableColumnsArray[1 % secondTableColumnsArray.length] +
                  ', ' +
                  staticTableName +
                  '.' +
                  staticTableColumnsArray[1 % staticTableColumnsArray.length] +
                  ', ' +
                  staticTableName +
                  '.' +
                  staticTableColumnsArray[2 % staticTableColumnsArray.length] +
                  ' FROM ' +
                  secondTableName +
                  ' INNER JOIN ' +
                  staticTableName +
                  ' ON ' +
                  secondTableName +
                  '.' +
                  secondTableConnectionKey +
                  '=' +
                  staticTableName +
                  '.' +
                  staticTableKey +
                  ' ORDER BY ' +
                  secondTableName +
                  '.' +
                  secondTableConnectionKey +
                  ' ASC, ' +
                  secondTableName +
                  '.' +
                  secondTableColumnsArray[3 % secondTableColumnsArray.length] +
                  ' DESC',
                // QUESTION 3
                'SELECT ' +
                  secondTableName +
                  '.' +
                  secondTableColumnsArray[1 % secondTableColumnsArray.length] +
                  ', ' +
                  staticTableName +
                  '.' +
                  staticTableColumnsArray[1 % staticTableColumnsArray.length] +
                  ', ' +
                  staticTableName +
                  '.' +
                  staticTableColumnsArray[2 % staticTableColumnsArray.length] +
                  ' FROM ' +
                  secondTableName +
                  ' RIGHT JOIN ' +
                  staticTableName +
                  ' ON ' +
                  secondTableName +
                  '.' +
                  secondTableConnectionKey +
                  '=' +
                  staticTableName +
                  '.' +
                  staticTableKey +
                  ' WHERE ' +
                  secondTableName +
                  '.' +
                  secondTableConnectionKey +
                  '>'+this.randomNumber(10),
                // QUESTION 4
                'SELECT ' +
                  secondTableName +
                  '.' +
                  secondTableColumnsArray[1 % secondTableColumnsArray.length] +
                  ', ' +
                  staticTableName +
                  '.' +
                  staticTableColumnsArray[1 % staticTableColumnsArray.length] +
                  ', ' +
                  staticTableName +
                  '.' +
                  staticTableColumnsArray[2 % staticTableColumnsArray.length] +
                  ' FROM ' +
                  secondTableName +
                  ' RIGHT JOIN ' +
                  staticTableName +
                  ' ON ' +
                  secondTableName +
                  '.' +
                  secondTableConnectionKey +
                  '=' +
                  staticTableName +
                  '.' +
                  staticTableKey +
                  ' WHERE ' +
                  secondTableName +
                  '.' +
                  secondTableConnectionKey +
                  '<'+this.randomNumber(10),
                // QUESTION 5
                'SELECT ' +
                  secondTableName +
                  '.' +
                  secondTableColumnsArray[1 % secondTableColumnsArray.length] +
                  ', ' +
                  staticTableName +
                  '.' +
                  staticTableColumnsArray[1 % staticTableColumnsArray.length] +
                  ', ' +
                  staticTableName +
                  '.' +
                  staticTableColumnsArray[2 % staticTableColumnsArray.length] +
                  ' FROM ' +
                  secondTableName +
                  ' LEFT JOIN ' +
                  staticTableName +
                  ' ON ' +
                  secondTableName +
                  '.' +
                  secondTableConnectionKey +
                  '=' +
                  staticTableName +
                  '.' +
                  staticTableKey +
                  ' WHERE ' +
                  staticTableName +
                  '.' +
                  staticTableColumnsArray[this.randomNumber(10) % staticTableColumnsArray.length] +
                  " LIKE '%e%'",
                // QUESTION 6
                'SELECT * FROM ' +
                  this.statictablename +
                  ' CROSS JOIN ' +
                  secondTableName +
                  ' WHERE ' +
                  staticTableName +
                  '.' +
                  staticTableKey +
                  '>'+static2rand+ ' AND ' +
                  staticTableName +
                  '.' +
                  staticTableKey +
                  '<'+(static2rand+5),
                // QUESTION 7
                'SELECT ' +
                  secondTableName +
                  '.' +
                  secondTableColumnsArray[1 % secondTableColumnsArray.length] +
                  ', ' +
                  staticTableName +
                  '.' +
                  staticTableColumnsArray[1 % staticTableColumnsArray.length] +
                  ', ' +
                  staticTableName +
                  '.' +
                  staticTableColumnsArray[2 % staticTableColumnsArray.length] +
                  ' FROM ' +
                  secondTableName +
                  ' LEFT JOIN ' +
                  staticTableName +
                  ' ON ' +
                  secondTableName +
                  '.' +
                  secondTableConnectionKey +
                  '=' +
                  staticTableName +
                  '.' +
                  staticTableKey,
                // QUESTION 8
                'SELECT ' +
                  secondTableColumnsArray[1 % secondTableColumnsArray.length] +
                  ' FROM ' +
                  secondTableName +
                  ' WHERE ' +
                  secondTableConnectionKey +
                  ' IN ( SELECT ' +
                  staticTableKey +
                  ' FROM ' +
                  staticTableName +
                  ' WHERE ' +
                  staticTableKey +
                  '<'+this.randomNumber(10)+' )',
                // QUESTION 9
                'SELECT ' +
                  secondTableColumnsArray[2 % secondTableColumnsArray.length] +
                  ', ' +
                  secondTableColumnsArray[3 % secondTableColumnsArray.length] +
                  ' FROM ' +
                  secondTableName +
                  ' UNION SELECT ' +
                  staticTableColumnsArray[2 % staticTableColumnsArray.length] +
                  ', ' +
                  staticTableColumnsArray[3 % staticTableColumnsArray.length] +
                  ' FROM ' +
                  staticTableName,
                // QUESTION 10
                'SELECT ' +
                  secondTableName +
                  '.' +
                  secondTableColumnsArray[2 % secondTableColumnsArray.length] +
                  ', ' +
                  secondTableName +
                  '.' +
                  secondTableColumnsArray[3 % secondTableColumnsArray.length] +
                  ' FROM ' +
                  secondTableName +
                  ' RIGHT JOIN ' +
                  staticTableName +
                  ' ON ' +
                  secondTableName +
                  '.' +
                  secondTableConnectionKey +
                  '=' +
                  staticTableName +
                  '.' +
                  staticTableKey +
                  ' WHERE NOT ' +
                  staticTableName +
                  '.' +
                  staticTableKey +
                  '='+this.randomNumber(10),
              ];

              this.http
                .post<any>(
                  this.url.baseUrl + 'addarrayofqueriestrueorfalse',
                  {
                    queriesArray: arrayOfRandomSqlQueriesTrueOrFalse,
                    table_name: staticTableName,
                  },
                  { headers }
                )
                .subscribe((data) => {
                  console.log(data);
                  if (data.result == 'Sql Queries successfully created!') {
                    this.tableArrayName = [];
                    this.tableColumnsArray = [];
                    this.tableColumnsArray2 = [];
                    this.dataOfEachTableArray = [];
                    this.onlyColumnsArray = [];
                    this.header_tale_name = '';
                    this.questionsOfEachTableArray = [];
                    this.questionsTrueOrFalseOfEachTableArray = [];

                    this.ngOnInit();
                    this.eachTableColumns(
                      this.statictable,
                      this.statictablename
                    );
                  } else {
                    Swal.fire(
                      'Ουπς...',
                      'Κάτι πήγε στραβά!Τα SQL Ερωτήματα δεν καταχωρήθηκαν',
                      'error'
                    );
                  }
                });
            } else {
              Swal.fire(
                'Ουπς...',
                'Κάτι πήγε στραβά!Τα SQL Ερωτήματα δεν καταχωρήθηκαν',
                'error'
              );
            }
          });
      } else if (result.isDenied) {
        this.tableArrayName = [];
        this.tableColumnsArray = [];
        this.tableColumnsArray2 = [];
        this.dataOfEachTableArray = [];
        this.onlyColumnsArray = [];
        this.header_tale_name = '';
        this.questionsOfEachTableArray = [];
        this.questionsTrueOrFalseOfEachTableArray = [];

        this.ngOnInit();
        this.eachTableColumns(this.statictable, this.statictablename);
      }
    });
  }

  delete(tablename) {
    var sqlQueryString = 'DROP TABLE ' + '`' + tablename + '`';
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
    });
    swalWithBootstrapButtons
      .fire({
        title: 'Διαγραφή Πίνακα ' + tablename,
        icon: 'warning',
        text: 'Είστε σίγουρος;Σε περίπτωση που υπάρχουν SQL ερωτήματα σε αυτόν θα διαγραφούν!',
        showCancelButton: true,
        confirmButtonText: 'Ναι',
        cancelButtonText: 'Ακύρωση',
      })
      .then((result) => {
        if (result.isConfirmed) {
          const headers = {
            'Content-Type': 'application/json; charset=UTF-8',
            Authorization: localStorage.getItem('token'),
          };

          this.http
            .post<any>(
              this.url.baseUrl + 'deleteatable',
              {
                sqlQueryString: sqlQueryString,
              },
              { headers }
            )
            .subscribe(
              (data) => {
                console.log(data);
                if (data.result) {
                  this.http
                    .delete<any>(
                      this.url.baseUrl +
                        'deleteallsqlqueriesfromspecifictable/' +
                        tablename,
                      { headers }
                    )
                    .subscribe(
                      (data) => {
                        console.log(data);
                        if (data.result) {
                          this.tableArrayName = [];
                          this.tableColumnsArray = [];
                          this.tableColumnsArray2 = [];
                          this.dataOfEachTableArray = [];
                          this.onlyColumnsArray = [];
                          this.header_tale_name = '';
                          this.questionsOfEachTableArray = [];
                          this.questionsTrueOrFalseOfEachTableArray = [];

                          Swal.fire(
                            '',
                            'Ο πίνακας ' + tablename + ' διαγράφτηκε επιτυχώς!',
                            'success'
                          );
                          this.ngOnInit();
                        }
                      },
                      (error) => {
                        Swal.fire('Oops...', error, 'error');
                      }
                    );
                } else if (data.error) {
                  Swal.fire(
                    'SQL Synatx error',
                    data.error.original.sqlMessage,
                    'error'
                  );
                }
              },
              (error) => {
                Swal.fire('Oops...', error, 'error');
              }
            );
        }
      });
  }

  updateQuestionTrueOrFalse(id, sql_query) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      edit: 'true',
      id,
      sql_query,
      tablename: this.header_tale_name,
    };
    let dialog = this.matDialog.open(
      DialogSqlQueryTrueOrFalseTableComponent,
      dialogConfig
    );
    dialog.afterClosed().subscribe((result) => {
      this.tableArrayName = [];
      this.tableColumnsArray = [];
      this.tableColumnsArray2 = [];
      this.dataOfEachTableArray = [];
      this.onlyColumnsArray = [];
      this.header_tale_name = '';
      this.questionsOfEachTableArray = [];
      this.questionsTrueOrFalseOfEachTableArray = [];

      this.ngOnInit();
      this.eachTableColumns(this.statictable, this.statictablename);
    });
  }

  updateQuestion(id, sql_query, hideWord) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      edit: 'true',
      id,
      sql_query,
      hideWord,
      tablename: this.header_tale_name,
    };
    let dialog = this.matDialog.open(
      DialogSqlQueryTableComponent,
      dialogConfig
    );
    dialog.afterClosed().subscribe((result) => {
      this.tableArrayName = [];
      this.tableColumnsArray = [];
      this.tableColumnsArray2 = [];
      this.dataOfEachTableArray = [];
      this.onlyColumnsArray = [];
      this.header_tale_name = '';
      this.questionsOfEachTableArray = [];
      this.questionsTrueOrFalseOfEachTableArray = [];

      this.ngOnInit();
      this.eachTableColumns(this.statictable, this.statictablename);
    });
  }

  removeQuestion(id) {
    Swal.fire({
      title: 'Είστε σίγουρος για την διαγραφή του SQL Ερωτήματος?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ναι, διαγραφή!',
      cancelButtonText: 'Ακύρωση',
    }).then((result) => {
      if (result.isConfirmed) {
        const headers = {
          'Content-Type': 'application/json; charset=UTF-8',
          Authorization: localStorage.getItem('token'),
        };
        this.http
          .delete<any>(
            this.url.baseUrl + 'deleteonesqlqueryfromspecifictable/' + id,
            { headers }
          )
          .subscribe(
            (data) => {
              console.log(data);
              if (data.result != 0) {
                this.tableArrayName = [];
                this.tableColumnsArray = [];
                this.tableColumnsArray2 = [];
                this.dataOfEachTableArray = [];
                this.onlyColumnsArray = [];
                this.header_tale_name = '';
                this.questionsOfEachTableArray = [];
                this.questionsTrueOrFalseOfEachTableArray = [];

                Swal.fire('', 'Το SQL Ερώτημα διαγράφτηκε επιτυχώς', 'success');
                this.ngOnInit();
                this.eachTableColumns(this.statictable, this.statictablename);
              } else {
                Swal.fire(
                  'Ουπς...',
                  'Κάτι πήγε στραβά!Παρακαλώ προσπαθήστε αργότερα.',
                  'error'
                );
              }
            },
            (error) => {
              Swal.fire('Oops...', error, 'error');
            }
          );
      }
    });
  }

  removeQuestionTrueOrFalse(id) {
    Swal.fire({
      title: 'Είστε σίγουρος για την διαγραφή του SQL Ερωτήματος?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ναι, διαγραφή!',
      cancelButtonText: 'Ακύρωση',
    }).then((result) => {
      if (result.isConfirmed) {
        const headers = {
          'Content-Type': 'application/json; charset=UTF-8',
          Authorization: localStorage.getItem('token'),
        };
        this.http
          .delete<any>(
            this.url.baseUrl +
              'deleteonesqlquerytrueorfalsefromspecifictable/' +
              id,
            { headers }
          )
          .subscribe(
            (data) => {
              console.log(data);
              if (data.result != 0) {
                this.tableArrayName = [];
                this.tableColumnsArray = [];
                this.tableColumnsArray2 = [];
                this.dataOfEachTableArray = [];
                this.onlyColumnsArray = [];
                this.header_tale_name = '';
                this.questionsOfEachTableArray = [];
                this.questionsTrueOrFalseOfEachTableArray = [];

                Swal.fire('', 'Το SQL Ερώτημα διαγράφτηκε επιτυχώς', 'success');
                this.ngOnInit();
                this.eachTableColumns(this.statictable, this.statictablename);
              } else {
                Swal.fire(
                  'Ουπς...',
                  'Κάτι πήγε στραβά!Παρακαλώ προσπαθήστε αργότερα.',
                  'error'
                );
              }
            },
            (error) => {
              Swal.fire('Oops...', error, 'error');
            }
          );
      }
    });
  }

  addQuestion() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = { edit: 'false', tablename: this.header_tale_name };
    let dialog = this.matDialog.open(
      DialogSqlQueryTableComponent,
      dialogConfig
    );
    dialog.afterClosed().subscribe((result) => {
      this.tableArrayName = [];
      this.tableColumnsArray = [];
      this.tableColumnsArray2 = [];
      this.dataOfEachTableArray = [];
      this.onlyColumnsArray = [];
      this.header_tale_name = '';
      this.questionsOfEachTableArray = [];
      this.questionsTrueOrFalseOfEachTableArray = [];

      this.ngOnInit();
      this.eachTableColumns(this.statictable, this.statictablename);
    });
  }

  addQuestionTrueOrFalse() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = { edit: 'false', tablename: this.header_tale_name };
    let dialog = this.matDialog.open(
      DialogSqlQueryTrueOrFalseTableComponent,
      dialogConfig
    );
    dialog.afterClosed().subscribe((result) => {
      this.tableArrayName = [];
      this.tableColumnsArray = [];
      this.tableColumnsArray2 = [];
      this.dataOfEachTableArray = [];
      this.onlyColumnsArray = [];
      this.header_tale_name = '';
      this.questionsOfEachTableArray = [];
      this.questionsTrueOrFalseOfEachTableArray = [];

      this.ngOnInit();
      this.eachTableColumns(this.statictable, this.statictablename);
    });
  }

  executeQuery(query) {
    const headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: localStorage.getItem('token'),
    };
    const body = {
      sqlQueryString: query,
    };
    this.http
      .post<any>(this.url.baseUrl + 'executesqlquery', body, {
        headers,
      })
      .subscribe((data) => {
        console.log(data);
        if (Object.keys(data).length === 0) {
          this.tableArrayName = [];
          this.tableColumnsArray = [];
          this.tableColumnsArray2 = [];
          this.dataOfEachTableArray = [];
          this.onlyColumnsArray = [];
          this.header_tale_name = '';
          this.questionsOfEachTableArray = [];
          this.questionsTrueOrFalseOfEachTableArray = [];

          Swal.fire('', 'Το SQL Ερώτημα εκτελέστηκε', 'success');
          this.ngOnInit();
          this.eachTableColumns(this.statictable, this.statictablename);
        } else if (data.error) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            allowOutsideClick: false,
            text: data.error.original.sqlMessage,
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
              this.writeQueryOnHisOwn(query);
            }
          });
        } else if (data.result) {
          if (Array.isArray(data.result)) {
            if (data.result.length == 0) {
              Swal.fire(
                'Αποτέλεσμα!',
                'Το SQL Ερώτημα επιστέφει έναν άδειο Πίνακα!',
                'info'
              );
            } else {
              var columnsArray = [];
              var dataArray = [];
              columnsArray = Object.keys(data.result[0]);
              dataArray = data.result;
              const dialogConfig = new MatDialogConfig();
              dialogConfig.data = {
                columnsArray: columnsArray,
                dataArray: dataArray,
                query: query,
              };
              let dialog = this.matDialog.open(
                DialogShowQueryResultsComponent,
                dialogConfig
              );
              dialog.afterClosed().subscribe((result) => {});
            }
          } else if ((data.result.serverStatus = 2)) {
            this.tableArrayName = [];
            this.tableColumnsArray = [];
            this.tableColumnsArray2 = [];
            this.dataOfEachTableArray = [];
            this.onlyColumnsArray = [];
            this.header_tale_name = '';
            this.questionsOfEachTableArray = [];
            this.questionsTrueOrFalseOfEachTableArray = [];

            Swal.fire('', 'Το SQL Ερώτημα εκτελέστηκε', 'success');
            this.ngOnInit();
            this.eachTableColumns(this.statictable, this.statictablename);
          } else {
            Swal.fire(
              '',
              'Ακόμη δεν υπάρχουν διαθέσιμα αποτελέσματα!',
              'warning'
            );
          }
        } else {
          this.tableArrayName = [];
          this.tableColumnsArray = [];
          this.tableColumnsArray2 = [];
          this.dataOfEachTableArray = [];
          this.onlyColumnsArray = [];
          this.header_tale_name = '';
          this.questionsOfEachTableArray = [];
          this.questionsTrueOrFalseOfEachTableArray = [];

          Swal.fire('', 'Το SQL Ερώτημα εκτελέστηκε', 'success');
          this.ngOnInit();
          this.eachTableColumns(this.statictable, this.statictablename);
        }
      });
  }
  addNewColumn() {
    var typeOfColumns = ['INT', 'VARCHAR', 'FLOAT', 'DATETIME', 'BOOLEAN'];
    Swal.fire({
      title: 'Ορίστε το όνομα της νέας στήλης του Πίνακα',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Συνέχεια',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Επιλέξτε τον τύπο για την νέα στήλη ' + result.value,
          cancelButtonText: 'Ακύρωση',
          input: 'select',
          width: 1000,
          inputOptions: {
            Στήλες: typeOfColumns,
          },
          showCancelButton: true,
          confirmButtonText: 'Συνέχεια',
          showLoaderOnConfirm: true,
          inputValidator: (position2) => {
            return new Promise(async (resolve) => {
              console.log(typeOfColumns[position2]);
              if (typeOfColumns[position2] != 'BOOLEAN') {
                Swal.fire({
                  title:
                    'Ορίστε το μέγεθος του τύπου ' + typeOfColumns[position2],
                  input: 'number',
                  inputAttributes: {
                    autocapitalize: 'off',
                  },
                  showCancelButton: true,
                  confirmButtonText: 'Συνέχεια',
                  cancelButtonText: 'Ακύρωση',
                }).then(async (result2) => {
                  if (result2.isConfirmed) {
                    const { value: formValues } = await Swal.fire({
                      title:
                        'Ορίστε τις ιδιότητες της νέας στήλης ' +
                        result.value +
                        ' ' +
                        typeOfColumns[position2] +
                        '(' +
                        result2.value +
                        ')',
                      html:
                        '<div><label> NN </label>' +
                        '<input  id="swal-inputnn" class="swal2-input" type="checkbox" value="NN"></div>' +
                        '<div><label> UQ </label>' +
                        '<input  id="swal-inputuk" class="swal2-input" type="checkbox" value="UQ"></div>',
                      focusConfirm: false,
                      cancelButtonText: 'Ακύρωση',
                      confirmButtonText: 'Ολοκλήρωση',
                      preConfirm: () => {
                        return [
                          (<HTMLInputElement>(
                            document.getElementById('swal-inputnn')
                          )).checked,
                          (<HTMLInputElement>(
                            document.getElementById('swal-inputuk')
                          )).checked,
                        ];
                      },
                    });
                    if (formValues) {
                      console.log(formValues[0], formValues[1]);

                      var notnull = '';
                      if (formValues[0]) {
                        notnull = ' NOT NULL';
                      }
                      var unique = '';
                      if (formValues[1]) {
                        unique = 'UNIQUE';
                      }

                      var sequenceSql =
                        'ALTER TABLE ' +
                        this.header_tale_name +
                        ' ADD ' +
                        result.value +
                        ' ' +
                        typeOfColumns[position2] +
                        '(' +
                        result2.value +
                        ')' +
                        ' ' +
                        notnull +
                        ' ' +
                        unique;
                      console.log(sequenceSql);

                      const headers = {
                        'Content-Type': 'application/json; charset=UTF-8',
                        Authorization: localStorage.getItem('token'),
                      };
                      const body = {
                        sqlQueryString: sequenceSql,
                      };
                      this.http
                        .post<any>(this.url.baseUrl + 'executesqlquery', body, {
                          headers,
                        })
                        .subscribe((data) => {
                          console.log(data);
                          if (data.result) {
                            this.tableArrayName = [];
                            this.tableColumnsArray = [];
                            this.tableColumnsArray2 = [];
                            this.dataOfEachTableArray = [];
                            this.onlyColumnsArray = [];
                            this.header_tale_name = '';
                            this.questionsOfEachTableArray = [];
                            this.questionsTrueOrFalseOfEachTableArray = [];

                            this.ngOnInit();
                          } else {
                            Swal.fire(
                              'SQL Synatx error',
                              data.error.original.sqlMessage,
                              'error'
                            );
                          }
                        });
                    }
                  }
                });
              } else {
                const { value: formValues } = await Swal.fire({
                  title: 'Ορίστε τις ιδιότητες της νέας στήλης ' + result.value,
                  html:
                    '<div><label> NN </label>' +
                    '<input  id="swal-inputnn" class="swal2-input" type="checkbox" value="NN"></div>' +
                    '<div><label> UQ </label>' +
                    '<input  id="swal-inputuk" class="swal2-input" type="checkbox" value="UQ"></div>',
                  focusConfirm: false,
                  cancelButtonText: 'Ακύρωση',
                  confirmButtonText: 'Ολοκλήρωση',
                  preConfirm: () => {
                    return [
                      (<HTMLInputElement>(
                        document.getElementById('swal-inputnn')
                      )).checked,
                      (<HTMLInputElement>(
                        document.getElementById('swal-inputuk')
                      )).checked,
                    ];
                  },
                });
                if (formValues) {
                  console.log(formValues[0], formValues[1]);

                  var notnull = '';
                  if (formValues[0]) {
                    notnull = ' NOT NULL';
                  }
                  var unique = '';
                  if (formValues[1]) {
                    unique = ' UNIQUE';
                  }
                  var sequenceSql =
                    'ALTER TABLE ' +
                    this.header_tale_name +
                    ' ADD ' +
                    result.value +
                    ' ' +
                    typeOfColumns[position2] +
                    ' ' +
                    notnull +
                    ' ' +
                    unique;

                  const headers = {
                    'Content-Type': 'application/json; charset=UTF-8',
                    Authorization: localStorage.getItem('token'),
                  };
                  const body = {
                    sqlQueryString: sequenceSql,
                  };
                  this.http
                    .post<any>(this.url.baseUrl + 'executesqlquery', body, {
                      headers,
                    })
                    .subscribe((data) => {
                      console.log(data);
                      if (data.result) {
                        this.tableArrayName = [];
                        this.tableColumnsArray = [];
                        this.tableColumnsArray2 = [];
                        this.dataOfEachTableArray = [];
                        this.onlyColumnsArray = [];
                        this.header_tale_name = '';
                        this.questionsOfEachTableArray = [];
                        this.questionsTrueOrFalseOfEachTableArray = [];

                        this.ngOnInit();
                      } else {
                        Swal.fire(
                          'SQL Synatx error',
                          data.error.original.sqlMessage,
                          'error'
                        );
                      }
                    });
                }
              }
            });
          },
        });
      }
    });
  }

  openInfoSwal(d) {
    console.log(this.tableColumnsArray);
    console.log(this.tableColumnsArray2);
    var reference_column_name = '-';
    var reference_column_table = '-';
    for (var i = 0; i < this.tableColumnsArray2.length; i++) {
      if (
        this.tableColumnsArray2[i].OTHER_VALUES.COLUMN_NAME == d.COLUMN_NAME
      ) {
        reference_column_name =
          this.tableColumnsArray2[i].OTHER_VALUES.REFERENCED_COLUMN_NAME;
        reference_column_table =
          this.tableColumnsArray2[i].OTHER_VALUES.REFERENCED_TABLE_NAME;
      }
    }
    var infoHtmlSting =
      'EXTRA: ' +
      d.EXTRA +
      '<br>COLUMN_KEY: ' +
      d.COLUMN_KEY +
      '<br>IS_NULLABLE: ' +
      d.IS_NULLABLE +
      '<br>REFERENCED_TABLE_NAME: ' +
      reference_column_name +
      '<br>REFERENCED_COLUMN_NAME: ' +
      reference_column_table;
    Swal.fire({
      title: d.COLUMN_NAME + '(' + d.COLUMN_TYPE + ')',
      html: infoHtmlSting,
    });
  }
  info() {
    Swal.fire(
      '',
      'Εκτελώντας είσοδο σε κάποιον από τους "Πίνακες" εμφανίζονται τα δεδομένα του και τα SQL Ερωτήματα που χρησιμοποιούνται στις κατηγορίες "Τεστ:Ερωτήσεις Συμπλήρωσης-Κενού σε Πίνακες" και "Τεστ:Ερωτήσεις Σωστού-Λάθους σε Πίνακες" των Εκπαιδευομένων...',
      'info'
    );
  }
  randomNumber(max): number {
    var numberRandom = Math.floor(Math.random() * Math.floor(max));
    return numberRandom;
  }
}
