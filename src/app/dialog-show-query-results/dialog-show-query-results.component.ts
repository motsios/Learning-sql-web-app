import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogSqlQuestionComponent } from '../dialog-sql-question/dialog-sql-question.component';

@Component({
  selector: 'app-dialog-show-query-results',
  templateUrl: './dialog-show-query-results.component.html',
  styleUrls: ['./dialog-show-query-results.component.css'],
})
export class DialogShowQueryResultsComponent implements OnInit {
  columnsArray = [];
  dataArray = [];
  query = '';
  constructor(
    private http: HttpClient,
    private router: Router,
    public dialogRef: MatDialogRef<DialogSqlQuestionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.columnsArray = this.data.columnsArray;
    this.dataArray = this.data.dataArray;
    this.query = this.data.query;
  }

  close() {
    this.dialogRef.close();
  }
}
