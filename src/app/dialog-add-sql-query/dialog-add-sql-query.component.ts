import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { DialogSqlQuestionComponent } from '../dialog-sql-question/dialog-sql-question.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dialog-add-sql-query',
  templateUrl: './dialog-add-sql-query.component.html',
  styleUrls: ['./dialog-add-sql-query.component.css'],
})
export class DialogAddSqlQueryComponent implements OnInit {
  datacolumns;
  valuesArray = [];
  onlyColumnsArray = [];
  tablenameheader = '';
  constructor(
    private http: HttpClient,
    private router: Router,
    public dialogRef: MatDialogRef<DialogSqlQuestionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    console.log(this.data);
    this.datacolumns = this.data;
    this.tablenameheader = this.datacolumns.tablename.table_name;
    console.log(this.datacolumns);
  }

  close() {
    this.dialogRef.close();
  }

  addQuestion() {
    var tablename = this.datacolumns.tablename.table_name;
    this.onlyColumnsArray = [];
    var addearsArray = [];
    for (var i = 0; i < this.datacolumns.tableColumnsArray.length; i++) {
      this.onlyColumnsArray.push(
        this.datacolumns.tableColumnsArray[i].COLUMN_NAME
      );
      console.log(this.valuesArray[i]);
      if (
        this.valuesArray[i] === undefined ||
        this.valuesArray[i] == '' ||
        this.valuesArray[i] == ' '
      ) {
        this.valuesArray[i] = 'null';
        addearsArray.push(this.valuesArray[i]);
      } else {
        addearsArray.push("'" + this.valuesArray[i] + "'");
      }
    }
    var sqlQuery =
      'INSERT INTO ' +
      tablename +
      '(' +
      this.onlyColumnsArray.join() +
      ') VALUES (' +
      addearsArray.join() +
      ')';
    console.log(sqlQuery);
    const headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: localStorage.getItem('token'),
    };
    this.http
      .post<any>(
        'http://localhost:3000/api/executesqlquery',
        {
          sqlQueryString: sqlQuery,
        },
        { headers }
      )
      .subscribe((data) => {
        console.log(data);
        if (data.error) {
          Swal.fire(
            'SQL Synatx error',
            data.error.original.sqlMessage,
            'error'
          );
        } else {
          this.close();
        }
      });
  }
  openInfoSwal(d) {
    console.log(d);
    var reference_column_name = '-';
    var reference_column_table = '-';
    for (var i = 0; i < this.datacolumns.tableColumnsArray2.length; i++) {
      if (
        this.datacolumns.tableColumnsArray2[i].OTHER_VALUES.COLUMN_NAME ==
        d.COLUMN_NAME
      ) {
        reference_column_name = this.datacolumns.tableColumnsArray2[i]
          .OTHER_VALUES.REFERENCED_COLUMN_NAME;
        reference_column_table = this.datacolumns.tableColumnsArray2[i]
          .OTHER_VALUES.REFERENCED_TABLE_NAME;
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
