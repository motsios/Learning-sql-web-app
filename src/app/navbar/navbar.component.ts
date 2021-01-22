import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  username = '';
  role = '';
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.role = localStorage.getItem('role');
  }

  myprofilePage() {
    this.router.navigate(['/myprofile']);
  }

  logout() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
    });
    swalWithBootstrapButtons
      .fire({
        title: 'Αποσύνδεση',
        icon: 'warning',
        text: 'Είστε σίγουρος;',
        showCancelButton: true,
        confirmButtonText: 'Ναι',
        cancelButtonText: 'Ακύρωση',
      })
      .then((result) => {
        if (result.isConfirmed) {
          localStorage.clear();
          this.router.navigate(['/']);
        }
      });
  }

  editprofile() {
    this.router.navigate(['/editprofile']);
  }

  allstudentsPage() {
    this.router.navigate(['/allstudentsprofile']);
  }

  sqlquestionsedit() {
    this.router.navigate(['/sqlquestionstable']);
  }

  fillfieldquestionsedit() {
    this.router.navigate(['/handlefillfieldquestions']);
  }

  myscores() {
    this.router.navigate(['/myscores']);
  }

  start15Quiz() {
    Swal.fire({
      title: 'Επιλέξτε τον βαθμό δυσκολίας για την εκκίνηση του Κουίζ 15 Ερωτήσεων',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Εύκολο`,
      denyButtonText: `Δύσκολο`,
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.setItem('difficulty', 'easy');
        localStorage.setItem('numberofquestions', '15');
        this.router.navigate(['/sqlquiz']);
      } else if (result.isDenied) {
        localStorage.setItem('difficulty', 'hard');
        localStorage.setItem('numberofquestions', '15');
        this.router.navigate(['/sqlquiz']);
      }
    });
  }

  start25Quiz() {
    Swal.fire({
      title: 'Επιλέξτε τον βαθμό δυσκολίας για την εκκίνηση του Κουίζ 25 Ερωτήσεων',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Εύκολο`,
      denyButtonText: `Δύσκολο`,
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.setItem('difficulty', 'easy');
        localStorage.setItem('numberofquestions', '25');
        this.router.navigate(['/sqlquiz']);
      } else if (result.isDenied) {
        localStorage.setItem('difficulty', 'hard');
        localStorage.setItem('numberofquestions', '25');
        this.router.navigate(['/sqlquiz']);
      }
    });
  }

  sqlfillfieldquestions() {
    this.router.navigate(['/fillfieldsqlquestions/0']);
  }

  generateNewSchema() {
    this.router.navigate(['/generateNewSchema']);
  }

  goToExistingShcema() {
    this.router.navigate(['/editExistingSchema']);
  }

  rankingPage() {
    this.router.navigate(['/ranking']);
  }

  introSQL() {
    this.router.navigate(['/theorySql']);
  }
  introSQL2() {
    this.router.navigate(['/theorySql2']);
  }
}
