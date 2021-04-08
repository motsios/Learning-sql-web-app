import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.css'],
})
export class EditprofileComponent implements OnInit {
  first_name = '';
  last_name = '';
  email = '';
  phone = '';
  role = '';
  username = '';
  sex = '';
  grrole = '';
  grsex = '';
  constructor(
    private router: Router,
    private http: HttpClient,
    private url: AppComponent,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('token') == null) {
      this.router.navigate(['']);
    }
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
          console.log('fdasfd');
        } else {
          this.phone = data.result['phone'];
          this.email = data.result['email'];
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
          this.sex =
            data.result['sex'][0].toUpperCase() +
            data.result['sex'].substr(1).toLowerCase();
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
  editFirstName() {
    Swal.fire({
      title: 'Καταχωρήστε το νέο όνομα σας',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Αποδοχή',
      showLoaderOnConfirm: true,
      preConfirm: (firstname) => {
        if (firstname) {
          const headers = {
            'Content-Type': 'application/json; charset=UTF-8',
            Authorization: localStorage.getItem('token'),
          };
          const body = { first_name: firstname };
          this.http
            .put<any>(
              this.url.baseUrl + 'editprofile/' + localStorage.getItem('id'),
              body,
              { headers }
            )
            .subscribe((data) => {
              console.log(data);
              if (data.result == 'Updated completed') {
                Swal.fire('', 'Η αλλαγή πραγματοποιήθηκε επιτυχώς!', 'success');
                this.ngOnInit();
              } else {
                Swal.fire(
                  'Ουπς...',
                  'Κάτι πήγε στραβά!Παρακαλώ προσπαθήστε αργότερα.',
                  'error'
                );
              }
            });
        } else {
          Swal.fire('', 'Υπάρχουν κενά πεδία!', 'error');
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  }
  editLastName() {
    Swal.fire({
      title: 'Καταχωρήστε το επίθετο σας',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Αποδοχή',
      showLoaderOnConfirm: true,
      preConfirm: (lastname) => {
        if (lastname) {
          const headers = {
            'Content-Type': 'application/json; charset=UTF-8',
            Authorization: localStorage.getItem('token'),
          };
          const body = { last_name: lastname };
          this.http
            .put<any>(
              this.url.baseUrl + 'editprofile/' + localStorage.getItem('id'),
              body,
              { headers }
            )
            .subscribe((data) => {
              console.log(data);
              if (data.result == 'Updated completed') {
                Swal.fire('', 'Η αλλαγή πραγματοποιήθηκε επιτυχώς!', 'success');
                this.ngOnInit();
              } else {
                Swal.fire(
                  'Ουπς...',
                  'Κάτι πήγε στραβά!Παρακαλώ προσπαθήστε αργότερα.',
                  'error'
                );
              }
            });
        } else {
          Swal.fire('', 'Υπάρχουν κενά πεδία!', 'error');
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  }
  editPassword() {
    Swal.fire({
      title: 'Καταχωρήστε τον νέο κωδικό πρόσβασης',
      input: 'password',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Αποδοχή',
      showLoaderOnConfirm: true,
      preConfirm: (password) => {
        if (password) {
          Swal.fire({
            title: 'Επαναλάβετε τον κωδικό',
            input: 'password',
            inputAttributes: {
              autocapitalize: 'off',
            },
            showCancelButton: true,
            confirmButtonText: 'Αποδοχή',
            showLoaderOnConfirm: true,
            preConfirm: (newpassword) => {
              if (newpassword) {
                if (newpassword == password) {
                  const headers = {
                    'Content-Type': 'application/json; charset=UTF-8',
                    Authorization: localStorage.getItem('token'),
                  };
                  const body = { password: newpassword };
                  this.http
                    .put<any>(
                      this.url.baseUrl +
                        'editprofile/' +
                        localStorage.getItem('id'),
                      body,
                      { headers }
                    )
                    .subscribe((data) => {
                      console.log(data);
                      if (data.result == 'Updated completed') {
                        Swal.fire(
                          '',
                          'Η αλλαγή πραγματοποιήθηκε επιτυχώς!',
                          'success'
                        );
                        this.ngOnInit();
                      } else {
                        Swal.fire(
                          'Ουπς...',
                          'Κάτι πήγε στραβά!Παρακαλώ προσπαθήστε αργότερα.',
                          'error'
                        );
                      }
                    });
                } else {
                  Swal.fire('', 'Οι κωδικοί δεν ταιριάζουν!', 'error');
                }
              } else {
                Swal.fire('', 'Υπάρχουν κενά πεδία!', 'error');
              }
            },
            allowOutsideClick: () => !Swal.isLoading(),
          });
        } else {
          Swal.fire('', 'Υπάρχουν κενά πεδία!', 'error');
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  }

  async editSex() {
    await Swal.fire({
      title: 'Επιλέξτε το φύλο',
      input: 'select',
      inputOptions: {
        male: 'Άνδρας',
        female: 'Γυναίκα',
      },
      showCancelButton: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          console.log(value);
          if (value === 'male') {
            const headers = {
              'Content-Type': 'application/json; charset=UTF-8',
              Authorization: localStorage.getItem('token'),
            };
            const body = { sex: 'male' };
            this.http
              .put<any>(
                this.url.baseUrl + 'editprofile/' + localStorage.getItem('id'),
                body,
                { headers }
              )
              .subscribe((data) => {
                console.log(data);
                if (data.result == 'Updated completed') {
                  Swal.fire(
                    '',
                    'Η αλλαγή πραγματοποιήθηκε επιτυχώς!',
                    'success'
                  );
                  this.ngOnInit();
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
            const body = { sex: 'female' };
            this.http
              .put<any>(
                this.url.baseUrl + 'editprofile/' + localStorage.getItem('id'),
                body,
                { headers }
              )
              .subscribe((data) => {
                console.log(data);
                if (data.result == 'Updated completed') {
                  Swal.fire(
                    '',
                    'Η αλλαγή πραγματοποιήθηκε επιτυχώς!',
                    'success'
                  );
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
        });
      },
    });
  }

  editEmail() {
    Swal.fire({
      title: 'Καταχωρήστε το νέο Email',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Αποδοχή',
      showLoaderOnConfirm: true,
      preConfirm: (email) => {
        if (email) {
          const headers = {
            'Content-Type': 'application/json; charset=UTF-8',
            Authorization: localStorage.getItem('token'),
          };
          const body = { email: email };
          this.http
            .put<any>(
              this.url.baseUrl + 'editprofile/' + localStorage.getItem('id'),
              body,
              { headers }
            )
            .subscribe((data) => {
              console.log(data);
              if (data.result == 'Updated completed') {
                Swal.fire('', 'Η αλλαγή πραγματοποιήθηκε επιτυχώς!', 'success');
                this.ngOnInit();
              } else {
                Swal.fire(
                  'Ουπς...',
                  'Κάτι πήγε στραβά!Παρακαλώ προσπαθήστε αργότερα.',
                  'error'
                );
              }
            });
        } else {
          Swal.fire('', 'Υπάρχουν κενά πεδία!', 'error');
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  }

  editPhone() {
    Swal.fire({
      title: 'Καταχωρήστε το νέο Τηλέφωνο',
      input: 'number',
      showCancelButton: true,
      confirmButtonText: 'Αποδοχή',
      showLoaderOnConfirm: true,
      preConfirm: (phone) => {
        if (phone) {
          if (phone.length != 10) {
            Swal.fire(
              '',
              'Προσπαθήστε ξανά!Το Τηλέφωνο δεν περιείχε 10 ψηφία!',
              'error'
            );
          } else {
            const headers = {
              'Content-Type': 'application/json; charset=UTF-8',
              Authorization: localStorage.getItem('token'),
            };
            const body = { phone: phone };
            this.http
              .put<any>(
                this.url.baseUrl + 'editprofile/' + localStorage.getItem('id'),
                body,
                { headers }
              )
              .subscribe((data) => {
                console.log(data);
                if (data.result == 'Updated completed') {
                  Swal.fire(
                    '',
                    'Η αλλαγή πραγματοποιήθηκε επιτυχώς!',
                    'success'
                  );
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
        } else {
          Swal.fire('', 'Υπάρχουν κενά πεδία!', 'error');
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  }
  async editrole() {
    await Swal.fire({
      title: 'Επιλέξτε τον νέο ρόλο',
      input: 'select',
      inputOptions: {
        student: 'Εκπαιδευόμενος',
        teacher: 'Καθηγητής',
      },
      showCancelButton: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          console.log(value);
          if (value === 'student') {
            const headers = {
              'Content-Type': 'application/json; charset=UTF-8',
              Authorization: localStorage.getItem('token'),
            };
            const body = { role: 'student' };
            this.http
              .put<any>(
                this.url.baseUrl + 'editprofile/' + localStorage.getItem('id'),
                body,
                { headers }
              )
              .subscribe((data) => {
                console.log(data);
                if (data.result == 'Updated completed') {
                  Swal.fire(
                    '',
                    'Η αλλαγή πραγματοποιήθηκε επιτυχώς!',
                    'success'
                  );
                  this.ngOnInit();
                } else {
                  Swal.fire(
                    'Ουπς...',
                    'Κάτι πήγε στραβά!Παρακαλώ προσπαθήστε αργότερα.',
                    'error'
                  );
                }
              });
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
                  const headers = {
                    'Content-Type': 'application/json; charset=UTF-8',
                    Authorization: localStorage.getItem('token'),
                  };
                  const body = { role: 'teacher' };
                  this.http
                    .put<any>(
                      this.url.baseUrl +
                        'editprofile/' +
                        localStorage.getItem('id'),
                      body,
                      { headers }
                    )
                    .subscribe((data) => {
                      if (data.result == 'Updated completed') {
                        Swal.fire(
                          '',
                          'Η αλλαγή πραγματοποιήθηκε επιτυχώς!',
                          'success'
                        );
                        this.ngOnInit();
                      } else {
                        Swal.fire(
                          'Ουπς...',
                          'Κάτι πήγε στραβά!Παρακαλώ προσπαθήστε αργότερα.',
                          'error'
                        );
                      }
                    });
                } else {
                  Swal.fire('', 'Λανθασμένος κωδικός!', 'error');
                }
              },
              allowOutsideClick: () => !Swal.isLoading(),
            });
          }
        });
      },
    });
  }
}
