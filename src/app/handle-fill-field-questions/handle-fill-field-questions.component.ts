import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AppComponent } from '../app.component';
import { DialogFillFieldQuestionComponent } from '../dialog-fill-field-question/dialog-fill-field-question.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-handle-fill-field-questions',
  templateUrl: './handle-fill-field-questions.component.html',
  styleUrls: ['./handle-fill-field-questions.component.css'],
})
export class HandleFillFieldQuestionsComponent implements OnInit {
  username = '';
  fillfieldsquestionsArray: Array<any> = [];
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
    this.getFillFieldQuestionsFromApi(localStorage.getItem('token'));
  }

  getFillFieldQuestionsFromApi(token) {
    const headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: token,
    };
    this.http
      .get<any>(this.url.baseUrl + '/getallfillfieldquestions', { headers })
      .subscribe((data) => {
        this.spinner.hide();
        if (data.questions) {
          this.fillfieldsquestionsArray = data.questions;
          console.log(this.fillfieldsquestionsArray);
        } else {
          Swal.fire('', 'Δεν υπάρχουν ακόμη ερωτήσεις!', 'error');
        }
      });
  }

  add() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = { edit: 'false' };
    let dialog = this.matDialog.open(
      DialogFillFieldQuestionComponent,
      dialogConfig
    );
    dialog.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  updateField(id, question, fill_field_question, hideWord) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      edit: 'true',
      id,
      question,
      fill_field_question,
      hideWord,
    };
    let dialog = this.matDialog.open(
      DialogFillFieldQuestionComponent,
      dialogConfig
    );
    dialog.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }
  remove(id: any) {
    Swal.fire({
      title: 'Είστε σίγουροι?',
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
          .delete<any>(this.url.baseUrl + 'deletefillfieldquestion/' + id, {
            headers,
          })
          .subscribe((data) => {
            console.log(data);
            if (data.result == 'Deleted completed') {
              Swal.fire(
                '',
                'Η ερώτηση συμπλήρωσης κενού διαγράφτηκε επιτυχώς',
                'success'
              );
              this.ngOnInit();
            } else {
              Swal.fire(
                '',
                'Η ερώτηση συμπλήρωσης κενού δεν διαγράφτηκε επιτυχώς!',
                'error'
              );
            }
          });
      }
    });
  }
  info() {
    Swal.fire(
      '',
      'Οι "Ερωτήσεις Συμπλήρωσης-κενού" αποσκοπούν στην εξάσκηση των Εκπαιδευομένων.Ομαδοποιούνται με βάση τις SQL δεσμευμένες λέξεις από το πεδίο "Αποκρυμμένες Λέξεις" του πίνακα,κατά την εμφάνιση τους στην κατηγορία "Εξάσκηση σε Ερωτήσεις Συμπλήρωσης-Κενού"...',
      'info'
    );
  }
}
