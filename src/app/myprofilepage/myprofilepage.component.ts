import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppComponent } from '../app.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-myprofilepage',
  templateUrl: './myprofilepage.component.html',
  styleUrls: ['./myprofilepage.component.css'],
})
export class MyprofilepageComponent implements OnInit {
  first_name = '';
  last_name = '';
  email = '';
  role = '';
  phone = '';
  username = '';
  sex = '';
  grsex = '';
  grrole = '';
  constructor(
    private router: Router,
    private http: HttpClient,
    private url: AppComponent,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.username = localStorage.getItem('username');
    this.getProfileFromApi(
      localStorage.getItem('id'),
      localStorage.getItem('token')
    );
  }

  getProfileFromApi(userid, token) {
    const headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: token,
    };
    this.http
      .get<any>(this.url.baseUrl + 'profile/' + userid, { headers })
      .subscribe((data) => {
        this.spinner.hide();
        if (data.result == null) {
          Swal.fire(
            'Ουπς...',
            'Κάτι πήγε στραβά!Παρακαλώ προσπαθήστε αργότερα.',
            'error'
          );
        } else {
          this.email = data.result['email'];
          this.phone = data.result['phone'];
          this.first_name =
            data.result['first_name'][0].toUpperCase() +
            data.result['first_name'].substr(1).toLowerCase();
          this.last_name =
            data.result['last_name'][0].toUpperCase() +
            data.result['last_name'].substr(1).toLowerCase();
          this.username = data.result['username'];
          this.role =
            data.result['role'][0].toUpperCase() +
            data.result['role'].substr(1).toLowerCase();
          if (this.role == 'Teacher') this.grrole = 'Καθηγητής';
          else this.grrole = 'Εκπαιδευόμενος';
          this.sex =
            data.result['sex'][0].toUpperCase() +
            data.result['sex'].substr(1).toLowerCase();
          if (this.sex == 'Male') this.grsex = 'Άνδρας';
          else this.grsex = 'Γυναίκα';
        }
      });
  }
}
