import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-sql-question',
  templateUrl: './dialog-sql-question.component.html',
  styleUrls: ['./dialog-sql-question.component.css'],
})
export class DialogSqlQuestionComponent implements OnInit {
  editoraddForm: FormGroup;
  submitted = false;

  edit = '';
  id = '';
  question = '';
  optiona = '';
  optionb = '';
  optionc = '';
  optiond = '';
  correct_answer = '';
  difficulty = '';
  score = '';

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
      this.optiona = this.data.optiona;
      this.optionb = this.data.optionb;
      this.optionc = this.data.optionc;
      this.optiond = this.data.optiond;
      this.correct_answer = this.data.correct_answer;
      this.difficulty = this.data.difficulty;
      this.score = this.data.score;

      this.editoraddForm = this.formBuilder.group({
        question: [this.question, Validators.required],
        optiona: [this.optiona, Validators.required],
        optionb: [this.optionb, Validators.required],
        optionc: [this.optionc, Validators.required],
        optiond: [this.optiond, Validators.required],
        correctanswer: [this.correct_answer, Validators.required],
        score: [this.score, Validators.required],
        difficulty: [this.difficulty, Validators.required],
      });
    } else {
      this.editoraddForm = this.formBuilder.group({
        question: ['', Validators.required],
        optiona: ['', Validators.required],
        optionb: ['', Validators.required],
        optionc: ['', Validators.required],
        optiond: ['', Validators.required],
        correctanswer: ['', Validators.required],
        score: ['', Validators.required],
        difficulty: ['', Validators.required],
      });
    }
  }

  get f() {
    return this.editoraddForm.controls;
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
        a: this.editoraddForm.value['optiona'],
        b: this.editoraddForm.value['optionb'],
        c: this.editoraddForm.value['optionc'],
        d: this.editoraddForm.value['optiond'],
        correct_answer: this.editoraddForm.value['correctanswer'],
        score: this.editoraddForm.value['score'],
        difficulty: this.editoraddForm.value['difficulty'],
      };
      this.http
        .put<any>('http://localhost:3000/api/editquestion/' + this.id, body, {
          headers,
        })
        .subscribe((data) => {
          if (data.result == 'Updated completed') {
            Swal.fire('', 'Η SQL ερτώτηση ανανεώθηκε επιτυχώς!', 'success');
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
        a: this.editoraddForm.value['optiona'],
        b: this.editoraddForm.value['optionb'],
        c: this.editoraddForm.value['optionc'],
        d: this.editoraddForm.value['optiond'],
        correct_answer: this.editoraddForm.value['correctanswer'],
        score: this.editoraddForm.value['score'],
        difficulty: this.editoraddForm.value['difficulty'],
      };
      this.http
        .post<any>('http://localhost:3000/api/addquestion', body, {
          headers,
        })
        .subscribe((data) => {
          if (data.result == 'Question added') {
            Swal.fire('', 'Η SQL ερτώτηση προστέθηκε επιτυχώς!', 'success');
            this.dialogRef.close();
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
  }
  close() {
    this.dialogRef.close();
  }
}
