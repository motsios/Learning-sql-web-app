import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { table } from 'console';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogAddSqlQueryComponent } from '../dialog-add-sql-query/dialog-add-sql-query.component';
import { DialogShowQueryResultsComponent } from '../dialog-show-query-results/dialog-show-query-results.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { IfStmt } from '@angular/compiler';

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
  statictable;
  statictablename = '';
  role = '';
  unstableColumnsArrayNames = [];
  constructor(
    private http: HttpClient,
    private url: AppComponent,
    private matDialog: MatDialog,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
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
    console.log(table);

    this.tableColumnsArray = table.temparray;
    this.tableColumnsArray2 = table.temparray2;
    for (var i = 0; i < table.temparray.length; i++) {
      this.onlyColumnsArray.push(table.temparray[i].COLUMN_NAME);
    }

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

  editcolumn(columnProperties) {
    console.log(columnProperties);
  }

  writeQueryOnHisOwn(defaultQuery?) {
    Swal.fire({
      title:
        'Διατυπώστε ένα SQL Ερώτημα για να εκτελεστεί στον Πίνακα ' +
        this.statictablename,
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
              query.toLowerCase().includes('alter')
            ) {
              return Swal.fire(
                '',
                'Δεν μπορείτε να εκτελέσετε DELETE, DROP ή ALTER SQL Ερώτημα!',
                'error'
              );
            }
          }
          if (
            query.toLowerCase().includes('excersice_tables') ||
            query.toLowerCase().includes('sql_random_queries') ||
            query.toLowerCase().includes('fill_fields_questions') ||
            query.toLowerCase().includes('user_table') ||
            query.toLowerCase().includes('sql_questions') ||
            query.toLowerCase().includes('score_table')
          ) {
            return Swal.fire(
              '',
              'Δεν μπορείτε να εκτελέσετε κάποιο SQL ερώτημα σε αυτόν τον πίνακα!',
              'error'
            );
          }
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
      this.ngOnInit();
      this.eachTableColumns(this.statictable, this.statictablename);
    });
  }

  async connect2Tables() {
    this.unstableColumnsArrayNames = [];

    await Swal.fire({
      title:
        'Επιλέξτε τον άλλο Πίνακα για την δημιουργία σύνδεσης μεταξύ τους...',
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
              ' ;',
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
                    this.statictablename,
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
                        Swal.fire(JSON.stringify(formValues));
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
                                    text:
                                      'Η προσθήκη της ιδιότητας του ξένου κλειδιού καταχωρήθηκε!!',
                                    icon: 'success',
                                    showCancelButton: false,
                                    confirmButtonColor: '#3085d6',
                                    confirmButtonText: 'Εντάξει',
                                  }).then((result) => {
                                    if (result.isConfirmed) {
                                      this.tableArrayName = [];
                                      this.tableColumnsArray = [];
                                      this.tableColumnsArray2 = [];
                                      this.dataOfEachTableArray = [];
                                      this.onlyColumnsArray = [];
                                      this.header_tale_name = '';
                                      this.questionsOfEachTableArray = [];
                                      this.ngOnInit();
                                      this.eachTableColumns(
                                        this.statictable,
                                        this.statictablename
                                      );
                                    } else {
                                      this.tableArrayName = [];
                                      this.tableColumnsArray = [];
                                      this.tableColumnsArray2 = [];
                                      this.dataOfEachTableArray = [];
                                      this.onlyColumnsArray = [];
                                      this.header_tale_name = '';
                                      this.questionsOfEachTableArray = [];
                                      this.ngOnInit();
                                      this.eachTableColumns(
                                        this.statictable,
                                        this.statictablename
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
                                    this.tableArrayName = [];
                                    this.tableColumnsArray = [];
                                    this.tableColumnsArray2 = [];
                                    this.dataOfEachTableArray = [];
                                    this.onlyColumnsArray = [];
                                    this.header_tale_name = '';
                                    this.questionsOfEachTableArray = [];
                                    Swal.fire({
                                      title: '',
                                      text:
                                        'Η προσθήκη της ιδιότητας του ξένου κλειδιού καταχωρήθηκε!',
                                      icon: 'success',
                                      showCancelButton: false,
                                      confirmButtonColor: '#3085d6',
                                      confirmButtonText: 'Εντάξει',
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                        this.ngOnInit();
                                        this.eachTableColumns(
                                          this.statictable,
                                          this.statictablename
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
        text:
          'Είστε σίγουρος;Δεν μπορείτε να το επαναφέρετε.Σε περίπτωση που υπάρχουν SQL ερωτήματα σε αυτόν θα διαγραφούν!',
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
  updateQuestion(id, question) {
    Swal.fire({
      title: 'Ανανέωση SQL Ερωτήματος',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      inputValue: question,
      width: 1000,
      showCancelButton: true,
      confirmButtonText: 'Apply',
      showLoaderOnConfirm: true,
      preConfirm: (query) => {
        if (query) {
          const headers = {
            'Content-Type': 'application/json; charset=UTF-8',
            Authorization: localStorage.getItem('token'),
          };
          const body = { sql_query: query };
          this.http
            .put<any>(
              this.url.baseUrl + 'updateonesqlqueryfromspecifictable/' + id,
              body,
              { headers }
            )
            .subscribe((data) => {
              console.log(data);
              if (data.result == 'Updated completed') {
                this.tableArrayName = [];
                this.tableColumnsArray = [];
                this.tableColumnsArray2 = [];
                this.dataOfEachTableArray = [];
                this.onlyColumnsArray = [];
                this.header_tale_name = '';
                this.questionsOfEachTableArray = [];
                Swal.fire('', 'Το SQL Ερώτημα ανανεώθηκε επιτυχώς!', 'success');
                this.ngOnInit();
                this.eachTableColumns(this.statictable, this.statictablename);
              } else {
                Swal.fire(
                  'Ουπς...',
                  'Κάτι πήγε στραβά!Παρακαλώ προσπαθήστε αργότερα.',
                  'error'
                );
              }
            });
        } else {
          Swal.fire('', 'Υπάρχουν κενά πεδία!', 'error');
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  }

  removeQuestion(id) {
    Swal.fire({
      title: 'Είστε σίγουρος για την διαγραφή του SQL Ερωτήματος?',
      text: 'Δεν μπορείτε να το επναφέρετε!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ναι, διαγραφή!',
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
    Swal.fire({
      title:
        'Καταχωρήστε ένα νέο ερώτημα για τον Πίνακα.',
      input: 'text',
      inputPlaceholder: 'SQL Ερώτημα',
      cancelButtonText: 'Ακύρωση',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      width: 1000,
      confirmButtonText: 'Αποδοχή',
      showLoaderOnConfirm: true,
      preConfirm: (query1) => {
        if (query1) {
          const headers = {
            'Content-Type': 'application/json; charset=UTF-8',
            Authorization: localStorage.getItem('token'),
          };
          const body = {
            query: query1,
            tablename: this.header_tale_name,
          };
          this.http
            .post<any>(
              this.url.baseUrl + 'addonesqlqueryfromspecifictable',
              body,
              {
                headers,
              }
            )
            .subscribe((data) => {
              console.log(data);
              if (data.result.id) {
                this.tableArrayName = [];
                this.tableColumnsArray = [];
                this.tableColumnsArray2 = [];
                this.dataOfEachTableArray = [];
                this.onlyColumnsArray = [];
                this.header_tale_name = '';
                this.questionsOfEachTableArray = [];
                Swal.fire('', 'Το SQL Ερώτημα προστέθηκε επιτυχώς', 'success');
                this.ngOnInit();
                this.eachTableColumns(this.statictable, this.statictablename);
              } else {
                Swal.fire(
                  'Ουπς...',
                  'Κάτι πήγε στραβά!Παρακαλώ προσπαθήστε αργότερα.',
                  'error'
                );
              }
            });
        } else {
          Swal.fire('', 'Υπάρχουν κενά πεδία!', 'error');
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  }
  studentExecuteQuery(query) {
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
          Swal.fire('', 'Το SQL Ερώτημα εκτελέστηκε', 'success');
          this.ngOnInit();
          this.eachTableColumns(this.statictable, this.statictablename);
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
        reference_column_name = this.tableColumnsArray2[i].OTHER_VALUES
          .REFERENCED_COLUMN_NAME;
        reference_column_table = this.tableColumnsArray2[i].OTHER_VALUES
          .REFERENCED_TABLE_NAME;
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
}
