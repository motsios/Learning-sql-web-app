import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from '../app.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-registerpage',
  templateUrl: './registerpage.component.html',
  styleUrls: ['./registerpage.component.css'],
})
export class RegisterpageComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  roles = '';
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private url: AppComponent
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        username: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(5)]],
        confirmpassword: ['', [Validators.required]],
        email: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        role: ['', [Validators.required]],
        sex: ['', [Validators.required]],
      },
      {
        validator: this.checkIfMatchingPasswords('password', 'confirmpassword'),
      }
    );
  }
  checkIfMatchingPasswords(
    passwordKey: string,
    passwordConfirmationKey: string
  ) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true });
      } else {
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      Swal.fire('', 'Υπάρχουν κενά πεδία!', 'error');
      this.loading = false;
      return;
    }
    if (this.registerForm.value['role'] == '1') {
      this.registerToApi('student');
    } else {
      Swal.fire({
        title: 'Πληκτρολογήστε τον μυστικό κωδικό των Καθηγητών',
        input: 'password',
        inputAttributes: {
          autocapitalize: 'off',
        },
        showCancelButton: true,
        confirmButtonText: 'Αποδοχή',
        showLoaderOnConfirm: true,
        preConfirm: (code) => {
          if (code == '111111') {
            this.registerToApi('teacher');
          } else {
            Swal.fire('', 'Λανθασμένος κωδικός!', 'error');
          }
        },
        allowOutsideClick: () => !Swal.isLoading(),
      });
    }
  }

  registerToApi(role) {
    var sex = '';
    if (this.registerForm.value['sex'] == '1') {
      sex = 'male';
    } else {
      sex = 'female';
    }
    const headers = { 'Content-Type': 'application/json' };
    this.http
      .post<any>(
        this.url.baseUrl + 'register',
        {
          first_name: this.registerForm.value['firstName'],
          last_name: this.registerForm.value['lastName'],
          phone: this.registerForm.value['phone'],
          email: this.registerForm.value['firstName'],
          username: this.registerForm.value['username'],
          password: this.registerForm.value['password'],
          sex: sex,
          role: role,
        },
        { headers }
      )
      .subscribe(
        (data) => {
          if (data.result == 'Registration completed') {
            Swal.fire('', 'Η εγγραφή ολοκληρώθηκε επιτυχώς!', 'success');
            this.router.navigate(['']);
          } else {
            Swal.fire('', 'Το όνομα χρήστη υπάρχει ήδη!', 'error');
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
  }
}
