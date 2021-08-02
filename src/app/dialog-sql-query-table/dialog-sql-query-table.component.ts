import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-dialog-sql-query-table',
  templateUrl: './dialog-sql-query-table.component.html',
  styleUrls: ['./dialog-sql-query-table.component.css'],
})
export class DialogSqlQueryTableComponent implements OnInit {
  editoraddForm: FormGroup;
  submitted = false;
  edit = '';
  tablename = '';
  id = '';
  sql_query = '';
  hideWord = '';

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    public dialogRef: MatDialogRef<DialogSqlQueryTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.edit = this.data.edit;
    this.tablename = this.data.tablename;

    if (this.edit == 'true') {
      this.id = this.data.id;
      this.sql_query = this.data.sql_query;
      this.hideWord = this.data.hideWord;
      this.editoraddForm = this.formBuilder.group({
        sql_query: [this.sql_query, Validators.required],
        hideWord: [this.hideWord, Validators.required],
      });
    } else {
      this.editoraddForm = this.formBuilder.group({
        sql_query: ['', Validators.required],
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
      'Γράψτε τις λέξεις όπως ακριβώς υπάρχουν στο SQL ερώτημα χωριζόμενες με κόμμα μεταξύ τους.Προσοχή να ΜΗΝ υπάρχουν ΚΕΝΑ!',
      'info'
    );
  }

  onSubmit() {
    console.log(this.sql_query);
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
        sql_query: this.editoraddForm.value['sql_query'],
        hideWord: this.editoraddForm.value['hideWord'],
      };
      this.http
        .put<any>(
          'http://localhost:3000/api/updateonesqlqueryfromspecifictable/' +
            this.id,
          body,
          {
            headers,
          }
        )
        .subscribe((data) => {
          console.log(data);
          if (data.result == 'Updated completed') {
            Swal.fire('', 'Το SQL ερώτημα ανανεώθηκε επιτυχώς!', 'success');
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
      console.log(this.sql_query + this.hideWord + this.tablename);
      const headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: localStorage.getItem('token'),
      };
      const body = {
        sql_query: this.editoraddForm.value['sql_query'],
        hideWord: this.editoraddForm.value['hideWord'],
        tablename: this.tablename,
      };
      this.http
        .post<any>(
          'http://localhost:3000/api/addonesqlqueryfromspecifictable',
          body,
          {
            headers,
          }
        )
        .subscribe((data) => {
          console.log(data);
          if (data.result) {
            Swal.fire('', 'Το SQL ερώτημα προστέθηκε επιτυχώς!', 'success');
            this.dialogRef.close();
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
