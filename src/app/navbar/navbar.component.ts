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
  static checked: string;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.role = localStorage.getItem('role');
  }

  myprofilePage() {
    NavbarComponent.checked = 'tab1';
    localStorage.setItem('insideFillFieldQuestionsTable', 'no');
    localStorage.setItem('insideFillFieldQuestionsTableTrueOrFalse', 'no');
    this.router.navigate(['/myprofile']);
  }

  logout() {
    NavbarComponent.checked = 'tab999';
    localStorage.setItem('insideFillFieldQuestionsTable', 'no');
    localStorage.setItem('insideFillFieldQuestionsTableTrueOrFalse', 'no');
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
        text: 'Είστε σίγουροι;',
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
    NavbarComponent.checked = 'tab99';
    localStorage.setItem('insideFillFieldQuestionsTable', 'no');
    localStorage.setItem('insideFillFieldQuestionsTableTrueOrFalse', 'no');
    this.router.navigate(['/editprofile']);
  }

  allstudentsPage() {
    NavbarComponent.checked = 'tab6';
    localStorage.setItem('insideFillFieldQuestionsTable', 'no');
    localStorage.setItem('insideFillFieldQuestionsTableTrueOrFalse', 'no');
    this.router.navigate(['/allstudentsprofile']);
  }

  sqlquestionsedit() {
    NavbarComponent.checked = 'tab3';
    localStorage.setItem('insideFillFieldQuestionsTable', 'no');
    localStorage.setItem('insideFillFieldQuestionsTableTrueOrFalse', 'no');
    this.router.navigate(['/sqlquestionstable']);
  }

  fillfieldquestionsedit() {
    NavbarComponent.checked = 'tab33';
    localStorage.setItem('insideFillFieldQuestionsTable', 'no');
    localStorage.setItem('insideFillFieldQuestionsTableTrueOrFalse', 'no');
    this.router.navigate(['/handlefillfieldquestions']);
  }

  myscores() {
    NavbarComponent.checked = 'tab9';
    localStorage.setItem('insideFillFieldQuestionsTable', 'no');
    localStorage.setItem('insideFillFieldQuestionsTableTrueOrFalse', 'no');
    this.router.navigate(['/myscores']);
  }

  start15Quiz() {
    localStorage.setItem('insideFillFieldQuestionsTable', 'no');
    localStorage.setItem('insideFillFieldQuestionsTableTrueOrFalse', 'no');
    Swal.fire({
      title:
        'Επιλέξτε τον βαθμό δυσκολίας για την εκκίνηση του κουίζ 15 Ερωτήσεων',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Εύκολο`,
      denyButtonText: `Δύσκολο`,
      cancelButtonText: 'Ακύρωση',
    }).then((result) => {
      if (result.isConfirmed) {
        NavbarComponent.checked = 'tab2';
        localStorage.setItem('difficulty', 'easy');
        localStorage.setItem('numberofquestions', '15');
        this.router.navigate(['/sqlquiz']);
      } else if (result.isDenied) {
        NavbarComponent.checked = 'tab2';
        localStorage.setItem('difficulty', 'hard');
        localStorage.setItem('numberofquestions', '15');
        this.router.navigate(['/sqlquiz']);
      }
    });
  }

  start25Quiz() {
    localStorage.setItem('insideFillFieldQuestionsTable', 'no');
    localStorage.setItem('insideFillFieldQuestionsTableTrueOrFalse', 'no');
    Swal.fire({
      title:
        'Επιλέξτε τον βαθμό δυσκολίας για την εκκίνηση του κουίζ 25 Ερωτήσεων',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Εύκολο`,
      denyButtonText: `Δύσκολο`,
      cancelButtonText: 'Ακύρωση',
    }).then((result) => {
      if (result.isConfirmed) {
        NavbarComponent.checked = 'tab22';
        localStorage.setItem('difficulty', 'easy');
        localStorage.setItem('numberofquestions', '25');
        this.router.navigate(['/sqlquiz']);
      } else if (result.isDenied) {
        NavbarComponent.checked = 'tab22';
        localStorage.setItem('difficulty', 'hard');
        localStorage.setItem('numberofquestions', '25');
        this.router.navigate(['/sqlquiz']);
      }
    });
  }

  sqlQuestionsToTables() {
    if (localStorage.getItem('insideFillFieldQuestionsTable') == 'yes') {
      NavbarComponent.checked = 'tab1';
      localStorage.setItem('insideFillFieldQuestionsTable', 'no');
      localStorage.setItem('insideFillFieldQuestionsTableTrueOrFalse', 'no');
      this.router.navigate(['/myprofile']);
    } else {
      NavbarComponent.checked = 'tab555';
      localStorage.setItem('insideFillFieldQuestionsTable', 'yes');
      localStorage.setItem('insideFillFieldQuestionsTableTrueOrFalse', 'no');
      this.router.navigate(['/questionsToTables/0']);
    }
  }

  sqlQuestionsToTablesTrueOrFalse() {
    if (
      localStorage.getItem('insideFillFieldQuestionsTableTrueOrFalse') == 'yes'
    ) {
      NavbarComponent.checked = 'tab1';
      localStorage.setItem('insideFillFieldQuestionsTable', 'no');
      localStorage.setItem('insideFillFieldQuestionsTableTrueOrFalse', 'no');
      this.router.navigate(['/myprofile']);
    } else {
      NavbarComponent.checked = 'tab5555';
      localStorage.setItem('insideFillFieldQuestionsTable', 'no');
      localStorage.setItem('insideFillFieldQuestionsTableTrueOrFalse', 'yes');
      this.router.navigate(['/questionsToTablesTrueOrFalse/0']);
    }
  }

  goToExistingShcema2() {
    NavbarComponent.checked = 'tab5';
    localStorage.setItem('insideFillFieldQuestionsTable', 'no');
    localStorage.setItem('insideFillFieldQuestionsTableTrueOrFalse', 'no');
    this.router.navigate(['/editExistingSchema']);
  }

  sqlfillfieldquestions() {
    NavbarComponent.checked = 'tab55';
    localStorage.setItem('insideFillFieldQuestionsTable', 'no');
    localStorage.setItem('insideFillFieldQuestionsTableTrueOrFalse', 'no');
    this.router.navigate(['/fillfieldsqlquestions/0']);
  }

  generateNewSchema() {
    NavbarComponent.checked = 'tab4';
    localStorage.setItem('insideFillFieldQuestionsTable', 'no');
    localStorage.setItem('insideFillFieldQuestionsTableTrueOrFalse', 'no');
    this.router.navigate(['/generateNewSchema']);
  }

  goToExistingShcema1() {
    NavbarComponent.checked = 'tab44';
    localStorage.setItem('insideFillFieldQuestionsTable', 'no');
    localStorage.setItem('insideFillFieldQuestionsTableTrueOrFalse', 'no');
    this.router.navigate(['/editExistingSchema']);
  }

  rankingPage() {
    NavbarComponent.checked = 'tab7';
    localStorage.setItem('insideFillFieldQuestionsTable', 'no');
    localStorage.setItem('insideFillFieldQuestionsTableTrueOrFalse', 'no');
    this.router.navigate(['/ranking']);
  }

  introSQL() {
    NavbarComponent.checked = 'tab8';
    localStorage.setItem('insideFillFieldQuestionsTable', 'no');
    localStorage.setItem('insideFillFieldQuestionsTableTrueOrFalse', 'no');
    this.router.navigate(['/theorySql']);
  }

  getChecked() {
    return NavbarComponent.checked;
  }
}
