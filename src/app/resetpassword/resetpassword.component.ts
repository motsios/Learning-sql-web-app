import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css'],
})
export class ResetpasswordComponent implements OnInit {
  resetForm: FormGroup;
  submitted = false;
  userid: string;
  loading = false;
  verification_code: string;
  constructor(
    private http: HttpClient,
    private url: AppComponent,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(5)]],
      repassword: ['', Validators.required],
    });

    var url = window.location.pathname;
    var splitted = url.split('/');
    this.userid = splitted[2];
    this.verification_code = splitted[3];
  }
  get f() {
    return this.resetForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.resetForm.invalid) {
      Swal.fire('', 'Υπάρχουν κενά πεδία!', 'error');
      this.loading = false;
      return;
    }
    if (
      this.resetForm.value['password'] == this.resetForm.value['repassword']
    ) {
      const headers = { 'Content-Type': 'application/json' };
      this.http
        .put<any>(
          this.url.baseUrl +
            'resetpassword/' +
            this.userid +
            '/' +
            this.verification_code,
          {
            password: this.resetForm.value['password'],
          },
          { headers }
        )
        .subscribe(
          (data) => {
            if (data.result == 'Updated completed') {
              Swal.fire(
                '',
                'Η αλλαγή του κωδικού πρόσβασης πραγματοποιήθηκε επιτυχώς!',
                'success'
              );
              this.loading = false;
              this.router.navigate(['']);
            } else {
              Swal.fire(
                'Ουπς...',
                'Κάτι πήγε στραβά! Σιγουρευτείτε ότι ανοίξατε το link του τελευταίου email που λάβατε!',
                'error'
              );
            }
          },
          (error) => {
            Swal.fire(
              'Ουπς...',
              'Κάτι πήγε στραβά!Παρακαλώ προσπαθήστε αργότερα.',
              'error'
            );
          }
        );
    } else {
      Swal.fire(
        '',
        'Ο κωδικός πρόσβασης δεν είναι ο ίδιος με τον Κωδικό Επαλήθευσης!',
        'error'
      );
    }
  }
}
