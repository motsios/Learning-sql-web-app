import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppComponent } from '../app.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogSqlQuestionComponent } from '../dialog-sql-question/dialog-sql-question.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sql-queries-table',
  templateUrl: './sql-queries-table.component.html',
  styleUrls: ['./sql-queries-table.component.css'],
})
export class SqlQueriesTableComponent implements OnInit {
  username = '';
  easyquestionsArray: Array<any> = [];
  hardquestionsArray: Array<any> = [];
  totalquestionsArray: Array<any> = [];
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
    this.spinner.show();
    this.username = localStorage.getItem('username');
    this.getQuestionsFromApi(localStorage.getItem('token'));
  }

  getQuestionsFromApi(token) {
    const headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: token,
    };
    this.http
      .get<any>(this.url.baseUrl + '/getquestions/easy', { headers })
      .subscribe((data) => {
        this.spinner.hide();
        if (data.questions) {
          this.easyquestionsArray = data.questions;
          console.log(this.easyquestionsArray);
        } else {
          Swal.fire('', 'Δεν υπάρχουν Εύκολες Ερωτήσεις!', 'error');
        }
      });
    this.http
      .get<any>(this.url.baseUrl + '/getquestions/hard', { headers })
      .subscribe((data) => {
        this.spinner.hide();
        if (data.questions) {
          this.hardquestionsArray = data.questions;
          console.log(this.hardquestionsArray);
        } else {
          Swal.fire('Oops...', 'Δεν υπάρχουν Δύσκολες Ερωτήσεις!', 'error');
        }
      });
  }

  updateField(
    id,
    question,
    optiona,
    optionb,
    optionc,
    optiond,
    correct_answer,
    score,
    difficulty
  ) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      edit: 'true',
      id,
      question,
      optiona,
      optionb,
      optionc,
      optiond,
      correct_answer,
      score,
      difficulty,
    };
    let dialog = this.matDialog.open(DialogSqlQuestionComponent, dialogConfig);
    dialog.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  add() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = { edit: 'false' };
    let dialog = this.matDialog.open(DialogSqlQuestionComponent, dialogConfig);
    dialog.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  remove(id: any) {
    Swal.fire({
      title: 'Είστε σίγουρος?',
      text: 'Δεν μπορείτε να το επαναφέρετε!',
      icon: 'warning',
      cancelButtonText: 'Ακύρωση',
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
          .delete<any>(this.url.baseUrl + 'question/' + id, { headers })
          .subscribe((data) => {
            console.log(data);
            if (data.result == 'Deleted completed') {
              Swal.fire('', 'Η ερώτηση διαγράφτηκε επιτυχώς', 'success');
              this.ngOnInit();
            } else {
              Swal.fire(
                'Ουπς...',
                'Κάτι πήγε στραβά!Παρακαλώ προσπαθήστε αργότερα.',
                'error'
              );
            }
          });
      }
    });
  }
  info(){
    Swal.fire(
      '',
      'Οι "Ερωτήσεις SQL Κουίζ"  χρησιμοποιούνται για την υλοποίηση των Κουίζ από τους Εκπαιδευόμενους.Κατηγοριοποιούνται σε εύκολες και δύσκολες με την καθεμία να κατέχει το δικό της Σκορ...',
      'info'
    );
  }
}
