import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from '../app.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomePageComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  token: string;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private url: AppComponent
  ) {}

  ngOnInit() {
    localStorage.clear();
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.loading = true;
    this.submitted = true;
    if (this.loginForm.invalid) {
      Swal.fire('', 'Υπάρχουν κενά πεδία!', 'error');
      this.loading = false;
      return;
    }
    const headers = { 'Content-Type': 'application/json' };
    this.http
      .post<any>(
        this.url.baseUrl + 'login',
        {
          username: this.loginForm.value['username'],
          password: this.loginForm.value['password'],
        },
        { headers }
      )
      .subscribe(
        (data) => {
          console.log(data);
          if (data.error == 'Wrong username or password') {
            Swal.fire(
              '',
              'Λανθασμένο το όνομα χρήστη ή ο κωδικός πρόσβασης!',
              'error'
            );
            this.loading = false;
          } else {
            this.loading = false;

            localStorage.setItem('token', data.token);
            localStorage.setItem('email', data.userdetails.email);
            localStorage.setItem('first_name', data.userdetails.first_name);
            localStorage.setItem('id', data.userdetails.id);
            localStorage.setItem('last_name', data.userdetails.last_name);
            localStorage.setItem('role', data.userdetails.role);
            localStorage.setItem('username', data.userdetails.username);
            this.router.navigate(['myprofile']);
          }
        },
        (error) => {
          this.loading = false;
          Swal.fire(
            'Ουπς...',
            'Κάτι πήγε στραβά!Παρακαλώ προσπαθήστε αργότερα.',
            'error'
          );
        }
      );
  }
  openSwal() {
    Swal.fire({
      title:
        'Παρακαλώ εισάγετε το όνομα χρήστη σας και θα σας σταλεί σύνδεσμος για την ανάκτηση του κωδικού πρόσβασης!',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      cancelButtonText:'Ακύρωση',
      width: 1000,
      confirmButtonText: 'Αποδοχή',
      showLoaderOnConfirm: true,
      preConfirm: (username) => {
        if (username) {
          const headers = {
            'Content-Type': 'application/json; charset=UTF-8',
          };
          this.http
            .get<any>(this.url.baseUrl + 'findUser/' + username, { headers })
            .subscribe((data) => {
              console.log(data);
              if (data.result == 'Email just sended') {
                Swal.fire('', 'Το email μόλις στάλθηκε!', 'success');
              } else {
                Swal.fire('', 'Αυτό το όνομα χρήστη δεν υπάρχει!', 'error');
              }
            });
        } else {
          Swal.fire('', 'Υπάρχουν κενά πεδία!', 'error');
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  }
}
