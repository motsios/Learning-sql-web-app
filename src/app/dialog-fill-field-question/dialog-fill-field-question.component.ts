import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogSqlQuestionComponent } from '../dialog-sql-question/dialog-sql-question.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-dialog-fill-field-question',
  templateUrl: './dialog-fill-field-question.component.html',
  styleUrls: ['./dialog-fill-field-question.component.css'],
})
export class DialogFillFieldQuestionComponent implements OnInit {
  editoraddForm: FormGroup;
  submitted = false;
  edit = '';
  id = '';
  question = '';
  fill_field_question = '';
  hideWord = '';

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    public dialogRef: MatDialogRef<DialogSqlQuestionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.edit = this.data.edit;
    if (this.edit == 'true') {
      this.id = this.data.id;
      this.question = this.data.question;
      this.fill_field_question = this.data.fill_field_question;
      this.hideWord = this.data.hideWord;

      this.editoraddForm = this.formBuilder.group({
        question: [this.question, Validators.required],
        fill_field_question: [this.fill_field_question, Validators.required],
        hideWord: [this.hideWord, Validators.required],
      });
    } else {
      this.editoraddForm = this.formBuilder.group({
        question: ['', Validators.required],
        fill_field_question: ['', Validators.required],
        hideWord: ['', Validators.required],
      });
    }
  }

  get f() {
    return this.editoraddForm.controls;
  }

  infoHideWord() {
    Swal.fire(
      'Αποκρυμμένη Λέξη',
      'Γράψτε τις λέξεις όπως ακριβώς υπάρχουν στο SQL Ερώτημα χωριζόμενες με κόμμα μεταξύ τους.Προσοχή να ΜΗΝ υπάρχουν ΚΕΝΑ!',
      'info'
    );
  }

  onSubmit() {
    this.submitted = true;
    if (this.editoraddForm.invalid) {
      Swal.fire('', 'Υπάρχουν κενά πεδία!', 'error');
      return;
    }
    if (this.edit == 'true') {
      const headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: localStorage.getItem('token'),
      };
      const body = {
        question: this.editoraddForm.value['question'],
        fill_field_question: this.editoraddForm.value['fill_field_question'],
        hideWord: this.editoraddForm.value['hideWord'],
      };
      this.http
        .put<any>(
          'https://salty-waters-54218.herokuapp.com/api/editfillfieldquestion/' + this.id,
          body,
          {
            headers,
          }
        )
        .subscribe((data) => {
          if (data.result == 'Updated completed') {
            Swal.fire(
              '',
              'Η ερώτηση συμπλήρωσης κενού ανανεώθηκε επιτυχώς!',
              'success'
            );
            this.dialogRef.close();
          } else {
            Swal.fire(
              'Ουπς...',
              'Κάτι πήγε στραβά!Παρακαλώ προσπαθήστε αργότερα.',
              'error'
            );
          }
        });
    } else {
      const headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: localStorage.getItem('token'),
      };
      const body = {
        question: this.editoraddForm.value['question'],
        fill_field_question: this.editoraddForm.value['fill_field_question'],
        hideWord: this.editoraddForm.value['hideWord'],
      };
      this.http
        .post<any>('https://salty-waters-54218.herokuapp.com/api/addfillfieldquestion', body, {
          headers,
        })
        .subscribe((data) => {
          if (data.result == 'Question added') {
            Swal.fire(
              '',
              'Η ερώτηση συμπλήρωσης κενού προστέθηκε επιτυχώς!',
              'success'
            );
            this.dialogRef.close();
            this.ngOnInit();
          } else {
            Swal.fire(
              'Oops...',
              'Κάτι πήγε στραβά!Παρακαλώ προσπαθήστε αργότερα.',
              'error'
            );
          }
        });
    }
  }
  close() {
    this.dialogRef.close();
  }
}
