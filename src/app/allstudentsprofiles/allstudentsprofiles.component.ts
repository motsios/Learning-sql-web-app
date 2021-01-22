import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-allstudentsprofiles',
  templateUrl: './allstudentsprofiles.component.html',
  styleUrls: ['./allstudentsprofiles.component.css'],
})
export class AllstudentsprofilesComponent implements OnInit {
  userid = '';
  token = '';
  studentsArray: Array<any>;
  moreinfoclick = false;
  clickscoreinfo = false;
  studentsex = '';
  studentrole = '';
  studentfirstname = '';
  studentlastname = '';
  studentusername = '';
  studentsgrsex = '';
  studentemail = '';
  studentphone = '';
  scoresArray: Array<any>;
  firstname = '';
  lastname = '';
  constructor(
    private router: Router,
    private http: HttpClient,
    private url: AppComponent,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.token = localStorage.getItem('token');
    this.getStudentsProfileFromApi(this.token);
  }

  getStudentsProfileFromApi(token) {
    const headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: token,
    };
    this.http
      .get<any>(this.url.baseUrl + 'allusers', { headers })
      .subscribe((data) => {
        this.spinner.hide();
        if (data.users) {
          this.studentsArray = data.users;
          console.log(this.studentsArray);
        } else {
          Swal.fire('', 'Δεν υπάρχουν χρήστες!', 'error');
        }
      });
  }
  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  moreinfo(studentid) {
    this.moreinfoclick = true;
    this.clickscoreinfo = false;

    const headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: this.token,
    };
    this.http
      .get<any>(this.url.baseUrl + '/profile/' + studentid, { headers })
      .subscribe((data) => {
        if (data.result) {
          this.studentsex =
            data.result.sex[0].toUpperCase() +
            data.result.sex.substr(1).toLowerCase();
          if (this.studentsex == 'Male') this.studentsgrsex = 'Άνδρας';
          else this.studentsgrsex = 'Γυναίκα';
          this.studentrole =
            data.result.role[0].toUpperCase() +
            data.result.role.substr(1).toLowerCase();
          this.studentfirstname =
            data.result.first_name[0].toUpperCase() +
            data.result.first_name.substr(1).toLowerCase();
          this.studentlastname =
            data.result.last_name[0].toUpperCase() +
            data.result.last_name.substr(1).toLowerCase();
          this.studentusername = data.result.username;
          this.studentemail = data.result.email;
          this.studentphone = data.result.phone;
        } else {
          Swal.fire(
            'Ουπς...',
            'Κάτι πήγε στραβά!Παρακαλώ προσπαθήστε αργότερα.',
            'error'
          );
        }
      });
  }

  scoreofeachstudent(studentid, first_name, last_name) {
    this.scoresArray = [];
    this.moreinfoclick = false;
    this.clickscoreinfo = true;
    this.firstname = first_name;
    this.lastname = last_name;
    const headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: this.token,
    };
    this.http
      .get<any>(this.url.baseUrl + '/scores/' + studentid, { headers })
      .subscribe((data) => {
        console.log(data.result[0].score_tables);
        if (data.result) {
          this.scoresArray = data.result[0].score_tables;
          if (data.result[0].score_tables.length == 0) {
            Swal.fire(
              '',
              'Ο εκπαιδευόμενος δεν έχει υλοποιήσει κάποιο Σκορ ακόμη!',
              'error'
            );
          }
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
