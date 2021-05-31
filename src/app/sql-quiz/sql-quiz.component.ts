import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { AppComponent } from '../app.component';
import { QuestionClass } from './question-class';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-sql-quiz',
  templateUrl: './sql-quiz.component.html',
  styleUrls: ['./sql-quiz.component.css'],
})
export class SqlQuizComponent implements OnInit {
  isQuestionCardShow: boolean = false;
  totalAnswered: number = 0;
  rightAnswer: number;
  rightScore: number;
  token = '';
  id = '';
  startquiz = false;
  difficulty = '';
  timer: number = 0;
  numberofquestions = '';
  converttimer;
  interval;
  stopquiz = false;
  grdifficulty = '';

  questionObj = new QuestionClass();
  @ViewChild('submitModal') submitModal: ModalDirective;
  @ViewChild('answerModal') answerModal: ModalDirective;
  @ViewChild('questionForm') questionForm: any;
  @ViewChild('questionTest') questionTest: any;
  constructor(
    private http: HttpClient,
    private url: AppComponent,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}
  answerArray = [];
  questionsArray: Array<any> = [];
  ngOnInit() {
    if (localStorage.getItem('token') == null) {
      this.router.navigate(['']);
    }
    this.spinner.show();
    this.difficulty = localStorage.getItem('difficulty');
    if (this.difficulty == 'easy') this.grdifficulty = 'Εύκολο';
    else this.grdifficulty = 'Δύσκολο';
    this.numberofquestions = localStorage.getItem('numberofquestions');
    this.id = localStorage.getItem('id');
    this.token = localStorage.getItem('token');
    this.getQuestionsFromApi(this.token, this.numberofquestions);
  }
  ngOnDestroy() {
    clearInterval(this.interval);
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.converttimer = this.toTime(this.timer);
      this.timer++;
    }, 1000);
  }
  toTime(seconds) {
    var date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  }

  getQuestionsFromApi(token, numberofquestions) {
    if (numberofquestions == '15') {
      const headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: token,
      };
      this.http
        .get<any>(this.url.baseUrl + 'get15quizquestions/' + this.difficulty, {
          headers,
        })
        .subscribe((data) => {
          this.spinner.hide();
          if (data.questions) {
            this.questionsArray = data.questions;
          } else {
            Swal.fire('', 'Δεν υπάρχουν ερωτήσεις!', 'error');
          }
        });
    } else {
      const headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: token,
      };
      this.http
        .get<any>(this.url.baseUrl + 'get25quizquestions/' + this.difficulty, {
          headers,
        })
        .subscribe((data) => {
          this.spinner.hide();
          if (data.questions) {
            this.questionsArray = data.questions;
          } else {
            Swal.fire('', 'Δεν υπάρχουν ερωτήσεις!', 'error');
          }
        });
    }
  }

  submitTest() {
    this.rightAnswer = 0;
    this.totalAnswered = 0;
    this.rightScore = 0;
    for (let i = 0; i < this.questionsArray.length; i++) {
      if (
        'selected' in this.questionsArray[i] &&
        this.questionsArray[i]['selected'] != null
      ) {
        this.totalAnswered++;
        if (
          this.questionsArray[i]['selected'] ==
          this.questionsArray[i]['correct_answer']
        ) {
          this.rightAnswer++;
          this.rightScore = this.rightScore + this.questionsArray[i]['score'];
        }
      }
    }
    if (this.totalAnswered < this.questionsArray.length) {
      Swal.fire({
        title:
          'Δεν απαντήθηκαν όλες οι ερωτήσεις!Θέλετε να συνεχίσετε την υποβολή;',
        showDenyButton: true,
        icon: 'error',
        confirmButtonText: `Ναι`,
        denyButtonText: `Όχι`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.applyTest();
        }
      });
    } else {
      this.applyTest();
    }
  }

  applyTest() {
    this.stopquiz = true;
    this.startquiz = false;
    const headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: this.token,
    };
    const body = {
      score: this.rightScore,
      difficulty: this.difficulty,
      time: this.converttimer,
      category: this.numberofquestions + ' Questions',
    };
    this.http
      .post<any>(this.url.baseUrl + 'addascore/' + this.id, body, { headers })
      .subscribe((data) => {
        if (data.result != 'This user are not a student') {
          Swal.fire(
            '',
            'Μόλις ολοκλήρωσες το SQL Κουίζ.Το Σκορ σου καταχωρήθηκε!Πατώντας τις Απαντήσεις μπορείς να ελέγξεις τις σωστές και τις λανθασμένες απαντήσεις',
            'success'
          );
          this.submitModal.show();
        } else {
          Swal.fire(
            'Ουπς...',
            'Κάτι πήγε στραβά!Παρακαλώ προσπαθήστε αργότερα.',
            'error'
          );
        }
      });
  }

  startQuiz() {
    this.startquiz = true;
    for (let i = 0; i < this.questionsArray.length; i++) {
      if ('selected' in this.questionsArray[i]) {
        delete this.questionsArray[i]['selected'];
      }
    }
    this.questionTest.reset();
    this.isQuestionCardShow = true;
  }
  HomePage() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
    });
    swalWithBootstrapButtons
      .fire({
        title: 'Ακύρωση',
        icon: 'warning',
        text: 'Είστε σίγουρος; Όλες οι απαντήσεις θα χαθούν!',
        showCancelButton: true,
        confirmButtonText: 'Ναι',
        cancelButtonText: 'Όχι',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/myscores']);
        }
      });
  }
  checkAnswers() {
    this.submitModal.hide();
    this.answerModal.show();
  }
  closeSubmitModal() {
    this.router.navigate(['/myscores']);
    this.submitModal.hide();
  }
  closeAnswerModal() {
    this.router.navigate(['/myscores']);
    this.answerModal.hide();
  }

  exportAsPDF() {
    let docDefinition = {
      content:
        'Το Σκορ σας στο  ' +
        this.grdifficulty +
        ' SQL Κουίζ ' +
        this.numberofquestions +
        ' Ερωτήσεων είναι ' +
        this.rightScore +
        '!' +
        '\n\nΑκολουθούν οι απαντήσεις που δόθηκαν:' +
        JSON.stringify(
          this.questionsArray,
          [
            'question',
            'a',
            'b',
            'c',
            'd',
            'selected',
            'correct_answer',
            'score',
          ],
          2
        )
          .split('{')
          .join('')
          .split('question')
          .join('Ερώτηση')
          .split('selected')
          .join('Επιλεγμένη απάντηση')
          .split('score')
          .join('Σκορ')
          .split('correct_answer')
          .join('Σωστή απάντηση')
          .split('}')
          .join('')
          .split(',')
          .join('')
          .split('"')
          .join('')
          .split('null')
          .join(' Δεν απαντήθηκε.')
          .split('[')
          .join('')
          .split(']')
          .join(''),
    };
    pdfMake.createPdf(docDefinition).open();
  }
}
