import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  ngOnInit(): void {}

  async createTable() {
    if (this.tablename.length == 0) {
      Swal.fire('', 'Ο Πίνακας δεν έχει όνομα!', 'error');
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
        text: 'Είστε σίγουρος?',
        showCancelButton: true,
        confirmButtonText: 'Ναι',
        cancelButtonText: 'Ακύρωση',
      })
      .then((result) => {
        if (result.isConfirmed) {
          localStorage.clear();
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
        'Ο Πίνακας πρέπει να περιλαμβάνει τουλάχιστον μία στήλη!',
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
            title: 'Δημιουργία Πίνακα!',
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
                        'Ο Πίνακας ' + this.tablename + ' υπάρχει ήδη!',
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
                        title:
                          'Ο πίνακας ' +
                          this.tablename +
                          ' δημιουργήθηκε επιτυχώς! Θέλετε να παραχθούν SQL Ερωτήματα για αυτόν;\n\n*Τα SQL Ερωτήματα θα εμφανίζονται στους Εκπαιδευόμενους στην κατηγορία "Τεστ: Ερωτήσεις Συμπλήρωσης-Κενού σε Πίνακες".  ',
                        showDenyButton: true,
                        icon: 'success',
                        confirmButtonText: `Ναι`,
                        denyButtonText: `Όχι`,
                      }).then((result) => {
                        if (result.isConfirmed) {
                          var max = this.columnsNamesArray.length;
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
                              this.columnsNamesArray[2 % max] +
                              ' FROM ' +
                              this.tablename,
                            // QUESTION 4
                            'SELECT * FROM ' +
                              this.tablename +
                              ' ORDER BY ' +
                              this.columnsNamesArray[3 % max],
                            // QUESTION 5
                            'SELECT * FROM ' +
                              this.tablename +
                              ' ORDER BY ' +
                              this.columnsNamesArray[2 % max] +
                              ' DESC',
                            // QUESTION 6
                            'SELECT MIN(' +
                              this.columnsNamesArray[0 % max] +
                              ') AS minValue ' +
                              ' FROM ' +
                              this.tablename,
                            // Question 7
                            'SELECT COUNT(' +
                              this.columnsNamesArray[2 % max] +
                              ') FROM ' +
                              this.tablename,
                            // Question 8
                            'SELECT COUNT(' +
                              this.columnsNamesArray[1 % max] +
                              '), ' +
                              this.columnsNamesArray[7 % max] +
                              ' FROM ' +
                              this.tablename +
                              ' GROUP BY ' +
                              this.columnsNamesArray[1 % max] +
                              ' HAVING COUNT(' +
                              this.columnsNamesArray[7 % max] +
                              ')',
                            //Question 9
                            'SELECT ' +
                              this.columnsNamesArray[10 % max] +
                              ' FROM ' +
                              this.tablename +
                              ' GROUP BY ' +
                              this.columnsNamesArray[10 % max],
                            //Question 10
                            'SELECT ' +
                              this.columnsNamesArray[0 % max] +
                              ' FROM ' +
                              this.tablename +
                              ' ORDER BY RAND() LIMIT 1',
                            //Question 11
                            'SELECT * FROM ' +
                              this.tablename +
                              ' WHERE ' +
                              this.columnsNamesArray[10 % max] +
                              ' = (SELECT MAX(' +
                              this.columnsNamesArray[0 % max] +
                              ') FROM ' +
                              this.tablename +
                              ')',
                            //Question 12
                            'SELECT ' +
                              this.columnsNamesArray[1 % max] +
                              ' FROM ' +
                              this.tablename +
                              ' UNION SELECT ' +
                              this.columnsNamesArray[2 % max] +
                              ' FROM ' +
                              this.tablename +
                              ' ORDER BY ' +
                              "'" +
                              this.columnsNamesArray[1 % max] +
                              "'",
                            //Question 13
                            'SELECT ' +
                              this.columnsNamesArray[4 % max] +
                              ', ' +
                              this.columnsNamesArray[3 % max] +
                              ' FROM ' +
                              this.tablename +
                              ' WHERE ' +
                              this.columnsNamesArray[4 % max] +
                              ' BETWEEN 1 AND 10 ORDER BY ' +
                              "'" +
                              this.columnsNamesArray[3 % max] +
                              "'",
                            //Question 14
                            'SELECT COUNT(' +
                              this.columnsNamesArray[4 % max] +
                              '), SUM(' +
                              this.columnsNamesArray[4 % max] +
                              ') FROM ' +
                              this.tablename +
                              ' WHERE ' +
                              this.columnsNamesArray[0 % max] +
                              " NOT BETWEEN '0' AND '10'",
                          ];
                          var randomnumberFromArray = Math.floor(
                            Math.random() *
                              Math.floor(arrayOfRandomSqlQueries.length)
                          );
                          var randomQueryFromUpperArray = [];

                          for (var i = 0; i < 5; i++) {
                            randomQueryFromUpperArray.push(
                              arrayOfRandomSqlQueries[randomnumberFromArray]
                            );
                            randomnumberFromArray =
                              (randomnumberFromArray + 1) %
                              arrayOfRandomSqlQueries.length;
                          }

                          this.http
                            .post<any>(
                              this.url.baseUrl + 'addarrayofqueries',
                              {
                                queriesArray: randomQueryFromUpperArray,
                                hiddenWordsArray: [
                                  'ok,okok,o',
                                  'opop,po',
                                  'sdsd',
                                  'ddd',
                                  'ds',
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
                                Swal.fire(
                                  'Τα SQL Ερωτήματα καταχωρήθηκαν επιτυχώς!',
                                  '',
                                  'success'
                                );
                                this.router.navigate(['/editExistingSchema']);
                              } else {
                                Swal.fire(
                                  'Ουπς...',
                                  'Κάτι πήγε στραβά!Τα SQL Ερωτήματα δεν καταχωρήθηκαν',
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
                    Swal.fire('Oops...', error, 'error');
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
  randomNumber(max): number {
    var numberRandom = Math.floor(Math.random() * Math.floor(max));
    return numberRandom;
  }
}
