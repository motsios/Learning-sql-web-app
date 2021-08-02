import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { stat } from 'fs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-generate-new-schema',
  templateUrl: './generate-new-schema.component.html',
  styleUrls: ['./generate-new-schema.component.css'],
})
export class GenerateNewSchemaComponent implements OnInit {
  fieldArray: Array<any> = [];
  newAttribute: any = {};
  columnsStringArray = [];
  columnsNamesArray = [];
  tablename = '';
  primarykey = '';
  selectedType: string = 'INT';
  sqlQueryString = '';
  constructor(
    private http: HttpClient,
    private url: AppComponent,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('token') == null) {
      this.router.navigate(['']);
    }
  }

  async createTable() {
    if (this.tablename.length == 0) {
      Swal.fire('', 'Ο πίνακας δεν έχει όνομα!', 'error');
    } else {
      await this.createSqlSquery();
    }
  }
  addFieldValue() {
    this.fieldArray.push(this.newAttribute);
    this.newAttribute = {};
  }
  deleteFieldValue(index) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
    });
    swalWithBootstrapButtons
      .fire({
        title: 'Διαγραφή Στήλης',
        icon: 'warning',
        text: 'Είστε σίγουροι?',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        showCancelButton: true,
        confirmButtonText: 'Ναι, διαγραφή!',
        cancelButtonText: 'Ακύρωση',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.fieldArray.splice(index, 1);
        }
      });
  }
  selectChangeHandler(event: any) {
    this.selectedType = event.target.value;
  }
  clearOthersPrimaries() {
    for (var i = 0; i < this.fieldArray.length; i++) {
      this.fieldArray[i]['primarykey'] = false;
      this.newAttribute['primarykey'] = false;
    }
  }

  createSqlSquery() {
    this.columnsStringArray = [];
    this.columnsNamesArray = [];
    this.tablename = this.tablename.toLowerCase();
    if (
      this.fieldArray.length == 0 &&
      JSON.stringify(this.newAttribute) == '{}'
    )
      Swal.fire(
        '',
        'Ο πίνακας πρέπει να περιλαμβάνει τουλάχιστον μία στήλη!',
        'error'
      );
    else {
      for (var i = 0; i < this.fieldArray.length; i++) {
        if (this.fieldArray[i]['primarykey'] == true) {
          this.primarykey =
            ',PRIMARY KEY (' + '`' + this.fieldArray[i]['name'] + '`' + ')';
        }
        var type = '';
        var notnull = '';
        var unique = '';
        var autoincrement = '';
        if (
          this.fieldArray[i]['type'] != 'TINYINT' &&
          this.fieldArray[i]['type'] != 'DATETIME'
        ) {
          type =
            this.fieldArray[i]['type'] + '(' + this.fieldArray[i]['size'] + ')';
        } else {
          type = this.fieldArray[i]['type'];
        }
        if (this.fieldArray[i]['notnull'] == true) {
          notnull = ' NOT NULL';
        }
        if (this.fieldArray[i]['unique'] == true) {
          unique = ' UNIQUE';
        }
        if (this.fieldArray[i]['autoincrement'] == true) {
          autoincrement = ' AUTO_INCREMENT';
        }
        this.fieldArray[i]['name'];
        this.columnsNamesArray.push(this.fieldArray[i]['name']);
        this.columnsStringArray.push(
          '`' +
            this.fieldArray[i]['name'] +
            '`' +
            ' ' +
            type +
            notnull +
            unique +
            autoincrement
        );
      }
      var type = '';
      var notnull = '';
      var unique = '';
      var autoincrement = '';
      if (this.newAttribute['primarykey'] == true) {
        this.primarykey =
          ',PRIMARY KEY (' + '`' + this.newAttribute['name'] + '`' + ')';
      }
      if (
        this.newAttribute['type'] != 'TINYINT' &&
        this.newAttribute['type'] != 'DATETIME'
      ) {
        type =
          this.newAttribute['type'] + '(' + this.newAttribute['size'] + ')';
      } else {
        type = this.newAttribute['type'];
      }
      if (this.newAttribute['notnull'] == true) {
        notnull = ' NOT NULL';
      }
      if (this.newAttribute['unique'] == true) {
        unique = ' UNIQUE';
      }
      if (this.newAttribute['autoincrement'] == true) {
        autoincrement = ' AUTO_INCREMENT';
      }
      this.columnsNamesArray.push(this.newAttribute['name']);
      this.columnsStringArray.push(
        '`' +
          this.newAttribute['name'] +
          '`' +
          ' ' +
          type +
          notnull +
          unique +
          autoincrement
      );
      this.sqlQueryString =
        'CREATE TABLE IF NOT EXISTS ' +
        '`' +
        this.tablename +
        '`' +
        '(' +
        this.columnsStringArray.join() +
        this.primarykey +
        ')';
      console.log(this.columnsStringArray);
      if (this.sqlQueryString.includes('PRIMARY KEY')) {
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger',
          },
        });
        swalWithBootstrapButtons
          .fire({
            title: 'Δημιουργία πίνακα!',
            icon: 'warning',
            text: this.sqlQueryString,
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
                  this.url.baseUrl + 'createTable',
                  {
                    tablename: this.tablename,
                    sqlQueryString: this.sqlQueryString,
                  },
                  { headers }
                )
                .subscribe(
                  (data) => {
                    console.log(data);
                    if (data.result == 'Table already exists') {
                      Swal.fire(
                        '',
                        'Ο πίνακας ' + this.tablename + ' υπάρχει ήδη!',
                        'error'
                      );
                    } else if (data.error) {
                      Swal.fire(
                        'SQL Synatx error',
                        data.error.original.sqlMessage,
                        'error'
                      );
                    } else {
                      Swal.fire({
                        width: '800',
                        title:
                          'Ο πίνακας ' +
                          this.tablename +
                          ' δημιουργήθηκε επιτυχώς! Θέλετε να παραχθούν SQL ερωτήματα για αυτόν;\n\n*Τα SQL ερωτήματα θα εμφανίζονται στους Εκπαιδευόμενους στις κατηγορίες "Τεστ: Ερωτήσεις Συμπλήρωσης-Κενού σε Πίνακες" και "Τεστ:Ερωτήσεις Σωστού-Λάθους σε Πίνακες".  ',
                        showDenyButton: true,
                        allowOutsideClick: false,
                        icon: 'success',
                        confirmButtonText: `Ναι`,
                        denyButtonText: `Όχι`,
                      }).then((result) => {
                        if (result.isConfirmed) {
                          var max = this.columnsNamesArray.length;
                          var staticrand = this.randomNumber(20);
                          var static2rand = this.randomNumber(20);
                          var static3rand = this.randomNumber(5);
                          var arrayOfRandomSqlQueries = [
                            // QUESTION 1
                            'SELECT * FROM ' + this.tablename,
                            // QUESTION 2
                            'SELECT ' +
                              this.columnsNamesArray[0 % max] +
                              ', ' +
                              this.columnsNamesArray[1 % max] +
                              ' FROM ' +
                              this.tablename,
                            // QUESTION 3
                            'SELECT DISTINCT ' +
                              this.columnsNamesArray[
                                this.randomNumber(20) % max
                              ] +
                              ' FROM ' +
                              this.tablename,
                            // Question 4
                            'SELECT COUNT(' +
                              this.columnsNamesArray[
                                this.randomNumber(20) % max
                              ] +
                              ') FROM ' +
                              this.tablename,
                            //QUESTION 5
                            'SELECT COUNT(DISTINCT ' +
                              this.columnsNamesArray[
                                this.randomNumber(20) % max
                              ] +
                              ') FROM ' +
                              this.tablename,
                            //QUESTION 6
                            'SELECT * FROM ' +
                              this.tablename +
                              ' WHERE ' +
                              this.columnsNamesArray[0 % max] +
                              '=' +
                              this.randomNumber(7),
                            //QUESTION 7
                            'SELECT * FROM ' +
                              this.tablename +
                              ' WHERE ' +
                              this.columnsNamesArray[0 % max] +
                              ' IN ("1","4")',
                            //QUESTION 8
                            'SELECT * FROM ' +
                              this.tablename +
                              ' WHERE ' +
                              this.columnsNamesArray[0 % max] +
                              ' BETWEEN ' +
                              static3rand +
                              ' AND ' +
                              (static3rand + 6),
                            // QUESTION 9
                            'SELECT * FROM ' +
                              this.tablename +
                              ' ORDER BY ' +
                              this.columnsNamesArray[
                                this.randomNumber(20) % max
                              ],
                            // QUESTION 10
                            'SELECT * FROM ' +
                              this.tablename +
                              ' ORDER BY ' +
                              this.columnsNamesArray[
                                this.randomNumber(20) % max
                              ] +
                              ' DESC',
                            // QUESTION 11
                            'SELECT * FROM ' +
                              this.tablename +
                              ' ORDER BY ' +
                              this.columnsNamesArray[static2rand % max] +
                              ' ASC, ' +
                              this.columnsNamesArray[(static2rand + 1) % max] +
                              ' DESC',
                            // QUESTION 12
                            'SELECT * FROM ' +
                              this.tablename +
                              ' LIMIT ' +
                              this.randomNumber(10),
                            // QUESTION 13
                            'SELECT MIN(' +
                              this.columnsNamesArray[0 % max] +
                              ')' +
                              ' FROM ' +
                              this.tablename,
                            // QUESTION 14
                            'SELECT MAX(' +
                              this.columnsNamesArray[0 % max] +
                              ')' +
                              ' FROM ' +
                              this.tablename,
                            // Question 15
                            'SELECT COUNT(' +
                              this.columnsNamesArray[staticrand % max] +
                              '), ' +
                              this.columnsNamesArray[(staticrand + 1) % max] +
                              ' FROM ' +
                              this.tablename +
                              ' GROUP BY ' +
                              this.columnsNamesArray[(staticrand + 1) % max],
                            // Question 16
                            'SELECT COUNT(' +
                              this.columnsNamesArray[static2rand % max] +
                              '), ' +
                              this.columnsNamesArray[(static2rand + 1) % max] +
                              ' FROM ' +
                              this.tablename +
                              ' GROUP BY ' +
                              this.columnsNamesArray[(static2rand + 1) % max] +
                              ' ORDER BY COUNT(' +
                              this.columnsNamesArray[static2rand % max] +
                              ') DESC',
                            // Question 17
                            'SELECT COUNT(' +
                              this.columnsNamesArray[2 % max] +
                              ') FROM ' +
                              this.tablename +
                              ' GROUP BY ' +
                              this.columnsNamesArray[
                                this.randomNumber(20) % max
                              ] +
                              ' HAVING COUNT(' +
                              this.columnsNamesArray[2 % max] +
                              ') >3',
                            //Question 18
                            'SELECT SUM(' +
                              this.columnsNamesArray[0 % max] +
                              ') FROM ' +
                              this.tablename,
                            //Question 19
                            'SELECT AVG(' +
                              this.columnsNamesArray[0 % max] +
                              ') FROM ' +
                              this.tablename,
                            //Question 20
                            'SELECT * FROM ' +
                              this.tablename +
                              ' WHERE ' +
                              this.columnsNamesArray[
                                this.randomNumber(20) % max
                              ] +
                              ' IS NULL',
                          ];

                          var arrayOfRandomSqlQueriesTrueOrFalse = [
                            // QUESTION 1
                            'SELECT * FROM ' + this.tablename,
                            // QUESTION 2
                            'SELECT * FROM ' +
                              this.tablename +
                              ' WHERE ' +
                              this.columnsNamesArray[0 % max] +
                              '>' +
                              this.randomNumber(5),
                            // QUESTION 3
                            'SELECT DISTINCT ' +
                              this.columnsNamesArray[0 % max] +
                              ' FROM ' +
                              this.tablename,
                            // QUESTION 4
                            'SELECT ' +
                              this.columnsNamesArray[0 % max] +
                              ' FROM ' +
                              this.tablename +
                              ' WHERE ' +
                              this.columnsNamesArray[0 % max] +
                              '=' +
                              this.randomNumber(5),
                            // QUESTION 5
                            'SELECT MIN(' +
                              this.columnsNamesArray[0 % max] +
                              ') FROM ' +
                              this.tablename,
                            // QUESTION 6
                            'SELECT COUNT(' +
                              this.columnsNamesArray[0 % max] +
                              ') FROM ' +
                              this.tablename,
                            // QUESTION 7
                            'SELECT AVG(' +
                              this.columnsNamesArray[0 % max] +
                              ') FROM ' +
                              this.tablename +
                              ' WHERE ' +
                              this.columnsNamesArray[0 % max] +
                              '>' +
                              this.randomNumber(10),
                            // QUESTION 8
                            'SELECT SUM(' +
                              this.columnsNamesArray[0 % max] +
                              ') FROM ' +
                              this.tablename +
                              ' WHERE ' +
                              this.columnsNamesArray[0 % max] +
                              '>' +
                              this.randomNumber(10),
                            // QUESTION 9
                            'SELECT ' +
                              this.columnsNamesArray[0 % max] +
                              ' FROM ' +
                              this.tablename +
                              ' WHERE NOT ' +
                              this.columnsNamesArray[0 % max] +
                              '>' +
                              this.randomNumber(10),
                            // QUESTION 10
                            'SELECT COUNT(' +
                              this.columnsNamesArray[1 % max] +
                              ') FROM ' +
                              this.tablename +
                              ' WHERE ' +
                              this.columnsNamesArray[0 % max] +
                              ' BETWEEN ' +
                              static3rand +
                              ' AND ' +
                              (static3rand + 4),
                            // QUESTION 11
                            'SELECT COUNT(DISTINCT ' +
                              this.columnsNamesArray[1 % max] +
                              ') ' +
                              ' FROM ' +
                              this.tablename,
                            // QUESTION 12
                            'SELECT * FROM ' +
                              this.tablename +
                              ' WHERE ' +
                              this.columnsNamesArray[0 % max] +
                              '=' +
                              static3rand +
                              ' OR ' +
                              this.columnsNamesArray[0 % max] +
                              '=' +
                              (static3rand + 6),
                            // QUESTION 13
                            'SELECT * FROM ' +
                              this.tablename +
                              ' ORDER BY ' +
                              this.columnsNamesArray[
                                this.randomNumber(20) % max
                              ] +
                              ' ASC',
                            // QUESTION 14
                            'SELECT * FROM ' +
                              this.tablename +
                              ' ORDER BY ' +
                              this.columnsNamesArray[
                                this.randomNumber(20) % max
                              ] +
                              ' DESC',
                            // QUESTION 15
                            'SELECT * FROM ' +
                              this.tablename +
                              ' ORDER BY ' +
                              this.columnsNamesArray[staticrand % max] +
                              ' ASC, ' +
                              this.columnsNamesArray[(staticrand + 1) % max] +
                              ' DESC',
                            // QUESTION 16
                            'SELECT * FROM ' +
                              this.tablename +
                              ' GROUP BY ' +
                              this.columnsNamesArray[
                                this.randomNumber(20) % max
                              ],
                            // QUESTION 17
                            'SELECT ' +
                              this.columnsNamesArray[1 % max] +
                              ' AS test FROM ' +
                              this.tablename +
                              ' WHERE ' +
                              this.columnsNamesArray[2 % max] +
                              " LIKE '" +
                              this.randomLetterOrNumber() +
                              "%'",
                            // QUESTION 18
                            'SELECT MAX(' +
                              this.columnsNamesArray[0 % max] +
                              ') AS test FROM ' +
                              this.tablename +
                              ' WHERE ' +
                              this.columnsNamesArray[0 % max] +
                              '<' +
                              this.randomNumber(10),
                            // QUESTION 19
                            'SELECT ' +
                              this.columnsNamesArray[
                                this.randomNumber(20) % max
                              ] +
                              ' AS test' +
                              ' FROM ' +
                              this.tablename,
                            // QUESTION 20
                            'SELECT * FROM ' +
                              this.tablename +
                              ' WHERE ' +
                              this.columnsNamesArray[
                                this.randomNumber(20) % max
                              ] +
                              " LIKE '%" +
                              this.randomLetterOrNumber() +
                              "%'",
                          ];

                          this.http
                            .post<any>(
                              this.url.baseUrl + 'addarrayofqueries',
                              {
                                queriesArray: arrayOfRandomSqlQueries,
                                hiddenWordsArray: [
                                  '*,' + this.tablename,
                                  this.columnsNamesArray[0 % max] +
                                    ',' +
                                    this.columnsNamesArray[1 % max],
                                  'DISTINCT',
                                  'COUNT,FROM',
                                  'DISTINCT',
                                  'WHERE,' + this.columnsNamesArray[0 % max],
                                  'IN',
                                  'BETWEEN,AND',
                                  'ORDER,BY',
                                  'ORDER,BY,DESC',
                                  'ORDER,BY,ASC,DESC',
                                  'LIMIT',
                                  'MIN',
                                  'MAX',
                                  'COUNT,GROUP,BY',
                                  'GROUP,BY,DESC',
                                  'GROUP,BY,HAVING,COUNT',
                                  'SUM',
                                  'AVG',
                                  'IS,NULL',
                                ],
                                table_name: this.tablename,
                              },
                              { headers }
                            )
                            .subscribe((data) => {
                              console.log(data);
                              if (
                                data.result ==
                                'Sql Queries successfully created!'
                              ) {
                                this.http
                                  .post<any>(
                                    this.url.baseUrl +
                                      'addarrayofqueriestrueorfalse',
                                    {
                                      queriesArray:
                                        arrayOfRandomSqlQueriesTrueOrFalse,
                                      table_name: this.tablename,
                                    },
                                    { headers }
                                  )
                                  .subscribe((data) => {
                                    console.log(data);
                                    if (
                                      data.result ==
                                      'Sql Queries successfully created!'
                                    ) {
                                      Swal.fire(
                                        'Τα SQL ερωτήματα καταχωρήθηκαν επιτυχώς!',
                                        '',
                                        'success'
                                      );
                                      this.router.navigate([
                                        '/editExistingSchema',
                                      ]);
                                    } else {
                                      Swal.fire(
                                        'Ουπς...',
                                        'Κάτι πήγε στραβά!Τα SQL ερωτήματα δεν καταχωρήθηκαν',
                                        'error'
                                      );
                                    }
                                  });
                              } else {
                                Swal.fire(
                                  'Ουπς...',
                                  'Κάτι πήγε στραβά!Τα SQL ερωτήματα δεν καταχωρήθηκαν',
                                  'error'
                                );
                              }
                            });
                        } else if (result.isDenied) {
                          this.router.navigate(['/editExistingSchema']);
                        }
                      });
                    }
                  },
                  (error) => {
                    Swal.fire('Ουπς...', error, 'error');
                  }
                );
            }
          });
      } else {
        Swal.fire(
          '',
          'Ο πίνακας ' + this.tablename + ' δεν περιέχει πρωτεύον κλειδί (PK)!',
          'error'
        );
      }
    }
  }
  info() {
    Swal.fire(
      '',
      'Με την "Προσθήκη νέου πίνακα" οι Εκπαιδευόμενοι μπορούν να ελέγξουν πως συμπεριφέρονται δικά τους SELECT ερωτήματα στην κατηγορία "Εξάσκηση SQL ερωτήσεων σε υπάρχοντα σχήματα",και να επιλύσουν Τεστ με ερωτήσεις που δημιουργούνται από το σύστημα ή από εσάς...',
      'info'
    );
  }
  randomNumber(max): number {
    var numberRandom = Math.floor(Math.random() * Math.floor(max));
    return numberRandom;
  }
  randomLetterOrNumber(): String {
    let r = Math.random().toString(36).substring(2, 3);
    return r;
  }
}
