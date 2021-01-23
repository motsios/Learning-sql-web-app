import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-sql-fill-field-questions',
  templateUrl: './sql-fill-field-questions.component.html',
  styleUrls: ['./sql-fill-field-questions.component.css'],
})
export class SqlFillFieldQuestionsComponent implements OnInit {
  username = '';
  questionid = '0';
  categorySelected = false;
  questionidToNumber;
  selectquestionsArray: Array<any> = [];
  hidewordsOfEachQuestion: Array<any> = [];
  wherequestionsArray: Array<any> = [];
  orderbyquestionsArray: Array<any> = [];
  insertquestionsArray: Array<any> = [];
  nullquestionsArray: Array<any> = [];
  updatequestionsArray: Array<any> = [];
  funquestionsArray: Array<any> = [];
  deletequestionsArray: Array<any> = [];
  likequestionsArray: Array<any> = [];
  wildcardsquestionsArray: Array<any> = [];
  betweenquestionsArray: Array<any> = [];
  inquestionsArray: Array<any> = [];
  aliasquestionsArray: Array<any> = [];
  groupbyquestionsArray: Array<any> = [];
  joinquestionsArray: Array<any> = [];
  header = '';
  fillfieldsquestionsArray: Array<any> = [];
  textfield = '';
  constructor(
    private http: HttpClient,
    private url: AppComponent,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _sanitizer: DomSanitizer
  ) {
    this.route.paramMap.subscribe(async (params) => {
      this.questionid = await params.get('id');
      this.questionidToNumber = Number(this.questionid);
    });
  }

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    this.username = localStorage.getItem('username');
    await this.getFillFieldQuestionsFromApi(localStorage.getItem('token'));
  }

  getFillFieldQuestionsFromApi(token) {
    const headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: token,
    };
    this.http
      .get<any>(this.url.baseUrl + '/getallfillfieldquestions', { headers })
      .subscribe((data) => {
        this.spinner.hide();
        if (data.questions) {
          for (let i = 0; i < data.questions.length; i++) {
            if (data.questions[i].hideWord.toLowerCase().includes('select'))
              this.selectquestionsArray.push(data.questions[i]);
            if (data.questions[i].hideWord.toLowerCase().includes('where'))
              this.wherequestionsArray.push(data.questions[i]);
            if (data.questions[i].hideWord.toLowerCase().includes('order'))
              this.orderbyquestionsArray.push(data.questions[i]);
            if (data.questions[i].hideWord.toLowerCase().includes('insert'))
              this.insertquestionsArray.push(data.questions[i]);
            if (data.questions[i].hideWord.toLowerCase().includes('null'))
              this.nullquestionsArray.push(data.questions[i]);
            if (data.questions[i].hideWord.toLowerCase().includes('update'))
              this.updatequestionsArray.push(data.questions[i]);
            if (data.questions[i].hideWord.toLowerCase().includes('delete'))
              this.deletequestionsArray.push(data.questions[i]);
            if (
              data.questions[i].hideWord.toLowerCase().includes('max') ||
              data.questions[i].hideWord.toLowerCase().includes('min') ||
              data.questions[i].hideWord.toLowerCase().includes('avg') ||
              data.questions[i].hideWord.toLowerCase().includes('sum') ||
              data.questions[i].hideWord.toLowerCase().includes('count')
            )
              this.funquestionsArray.push(data.questions[i]);
            if (data.questions[i].hideWord.toLowerCase().includes('like'))
              this.likequestionsArray.push(data.questions[i]);
            if (data.questions[i].hideWord.toLowerCase().includes('%'))
              this.wildcardsquestionsArray.push(data.questions[i]);
            if (data.questions[i].hideWord.toLowerCase().includes('in,'))
              this.inquestionsArray.push(data.questions[i]);
            if (data.questions[i].hideWord.toLowerCase().includes('between'))
              this.betweenquestionsArray.push(data.questions[i]);
            if (data.questions[i].hideWord.toLowerCase().includes('as'))
              this.aliasquestionsArray.push(data.questions[i]);
            if (data.questions[i].hideWord.toLowerCase().includes('join'))
              this.joinquestionsArray.push(data.questions[i]);
            if (data.questions[i].hideWord.toLowerCase().includes('group'))
              this.groupbyquestionsArray.push(data.questions[i]);
          }
          this.fillfieldsquestionsArray = data.questions;
          console.log(this.fillfieldsquestionsArray);
          console.log(this.selectquestionsArray);
          console.log(this.wherequestionsArray);
          console.log(this.orderbyquestionsArray);
          console.log(this.insertquestionsArray);
          console.log(this.nullquestionsArray);
          console.log(this.updatequestionsArray);
          console.log(this.funquestionsArray);
          console.log(this.deletequestionsArray);
          console.log(this.likequestionsArray);
          console.log(this.wildcardsquestionsArray);
          console.log(this.betweenquestionsArray);
          console.log(this.inquestionsArray);
          console.log(this.aliasquestionsArray);
          console.log(this.groupbyquestionsArray);
          console.log(this.joinquestionsArray);
        } else {
          Swal.fire('', 'Δεν υπάρχουν ερωτήσεις!', 'error');
        }
      });
  }

  next(questionid) {
    var text = this.textfield;
    const headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: localStorage.getItem('token'),
    };
    this.http
      .get<any>(this.url.baseUrl + '/getonefillfieldquestions/' + questionid, {
        headers,
      })
      .subscribe((data) => {
        if (data.questions) {
          if (text.toLowerCase() == data.questions[0].hideWord.toLowerCase()) {
            Swal.fire({
              title: 'Απάντηση',
              icon: 'success',
              text: 'Σωστή!',
              showCancelButton: true,
              confirmButtonText: `Επόμενη Ερώτηση`,
            }).then((result) => {
              if (result.isConfirmed) {
                if (
                  this.fillfieldsquestionsArray.length - 2 <
                  this.questionidToNumber
                ) {
                  Swal.fire(
                    '',
                    'Οι ερωτήσεις σε αυτήν την κατηγορία τελείωσαν!',
                    'info'
                  );
                } else {
                  this.textfield = '';
                  this.questionidToNumber = this.questionidToNumber + 1;
                  this.router.navigate([
                    '/fillfieldsqlquestions/' + this.questionidToNumber,
                  ]);
                }
              }
            });
          } else {
            Swal.fire(
              'Απάντηση',
              'Λάθος.Σιγουρευτείτε πως δεν περιέχονται περιττά κενά μεταξύ των απαντήσεων!',
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

  select() {
    this.textfield = '';
    this.hidewordsOfEachQuestion = [];
    this.categorySelected = true;
    this.header = 'SQL Select';
    if (this.selectquestionsArray.length != 0) {
      this.fillfieldsquestionsArray = this.selectquestionsArray;
      for (let i = 0; i < this.fillfieldsquestionsArray.length; i++) {
        this.hidewordsOfEachQuestion.push(
          this.fillfieldsquestionsArray[i].hideWord.split(',')
        );
      }
      for (let j = 0; j < this.hidewordsOfEachQuestion.length; j++) {
        for (let k = 0; k < this.hidewordsOfEachQuestion[j].length; k++) {
          this.fillfieldsquestionsArray[
            j
          ].fill_field_question = this.fillfieldsquestionsArray[
            j
          ].fill_field_question.replace(
            this.hidewordsOfEachQuestion[j][k],
            '___'
          );
        }
      }
      this.router.navigate(['/fillfieldsqlquestions/0']);
    } else {
      Swal.fire('', 'Δεν υπάρχουν ερωτήσεις σε αυτήν την κατηγορία!', 'info');
    }
  }

  where() {
    this.textfield = '';
    this.hidewordsOfEachQuestion = [];
    this.categorySelected = true;
    this.header = 'SQL Where';
    if (this.wherequestionsArray.length != 0) {
      this.fillfieldsquestionsArray = this.wherequestionsArray;
      for (let i = 0; i < this.fillfieldsquestionsArray.length; i++) {
        this.hidewordsOfEachQuestion.push(
          this.fillfieldsquestionsArray[i].hideWord.split(',')
        );
      }
      for (let j = 0; j < this.hidewordsOfEachQuestion.length; j++) {
        for (let k = 0; k < this.hidewordsOfEachQuestion[j].length; k++) {
          this.fillfieldsquestionsArray[
            j
          ].fill_field_question = this.fillfieldsquestionsArray[
            j
          ].fill_field_question.replace(
            this.hidewordsOfEachQuestion[j][k],
            '___'
          );
        }
      }
      this.router.navigate(['/fillfieldsqlquestions/0']);
    } else {
      Swal.fire('', 'Δεν υπάρχουν ερωτήσεις σε αυτήν την κατηγορία!', 'info');
    }
  }

  order() {
    this.textfield = '';
    this.hidewordsOfEachQuestion = [];
    this.categorySelected = true;
    this.header = 'SQL Order By';
    if (this.orderbyquestionsArray.length != 0) {
      this.fillfieldsquestionsArray = this.orderbyquestionsArray;
      for (let i = 0; i < this.fillfieldsquestionsArray.length; i++) {
        this.hidewordsOfEachQuestion.push(
          this.fillfieldsquestionsArray[i].hideWord.split(',')
        );
      }
      for (let j = 0; j < this.hidewordsOfEachQuestion.length; j++) {
        for (let k = 0; k < this.hidewordsOfEachQuestion[j].length; k++) {
          this.fillfieldsquestionsArray[
            j
          ].fill_field_question = this.fillfieldsquestionsArray[
            j
          ].fill_field_question.replace(
            this.hidewordsOfEachQuestion[j][k],
            '___'
          );
        }
      }
      this.router.navigate(['/fillfieldsqlquestions/0']);
    } else {
      Swal.fire('', 'Δεν υπάρχουν ερωτήσεις σε αυτήν την κατηγορία!', 'info');
    }
  }

  insert() {
    this.textfield = '';
    this.hidewordsOfEachQuestion = [];
    this.categorySelected = true;
    this.header = 'SQL Insert';
    if (this.insertquestionsArray.length != 0) {
      this.fillfieldsquestionsArray = this.insertquestionsArray;
      for (let i = 0; i < this.fillfieldsquestionsArray.length; i++) {
        this.hidewordsOfEachQuestion.push(
          this.fillfieldsquestionsArray[i].hideWord.split(',')
        );
      }
      for (let j = 0; j < this.hidewordsOfEachQuestion.length; j++) {
        for (let k = 0; k < this.hidewordsOfEachQuestion[j].length; k++) {
          this.fillfieldsquestionsArray[
            j
          ].fill_field_question = this.fillfieldsquestionsArray[
            j
          ].fill_field_question.replace(
            this.hidewordsOfEachQuestion[j][k],
            '___'
          );
        }
      }
      this.router.navigate(['/fillfieldsqlquestions/0']);
    } else {
      Swal.fire('', 'Δεν υπάρχουν ερωτήσεις σε αυτήν την κατηγορία!', 'info');
    }
  }

  null1() {
    this.textfield = '';
    this.hidewordsOfEachQuestion = [];
    this.categorySelected = true;
    this.header = 'SQL Null';
    if (this.nullquestionsArray.length != 0) {
      this.fillfieldsquestionsArray = this.nullquestionsArray;
      for (let i = 0; i < this.fillfieldsquestionsArray.length; i++) {
        this.hidewordsOfEachQuestion.push(
          this.fillfieldsquestionsArray[i].hideWord.split(',')
        );
      }
      for (let j = 0; j < this.hidewordsOfEachQuestion.length; j++) {
        for (let k = 0; k < this.hidewordsOfEachQuestion[j].length; k++) {
          this.fillfieldsquestionsArray[
            j
          ].fill_field_question = this.fillfieldsquestionsArray[
            j
          ].fill_field_question.replace(
            this.hidewordsOfEachQuestion[j][k],
            '___'
          );
        }
      }
      this.router.navigate(['/fillfieldsqlquestions/0']);
    } else {
      Swal.fire('', 'Δεν υπάρχουν ερωτήσεις σε αυτήν την κατηγορία!', 'info');
    }
  }

  update() {
    this.textfield = '';
    this.hidewordsOfEachQuestion = [];
    this.categorySelected = true;
    this.header = 'SQL Update';
    if (this.updatequestionsArray.length != 0) {
      this.fillfieldsquestionsArray = this.updatequestionsArray;
      for (let i = 0; i < this.fillfieldsquestionsArray.length; i++) {
        this.hidewordsOfEachQuestion.push(
          this.fillfieldsquestionsArray[i].hideWord.split(',')
        );
      }
      for (let j = 0; j < this.hidewordsOfEachQuestion.length; j++) {
        for (let k = 0; k < this.hidewordsOfEachQuestion[j].length; k++) {
          this.fillfieldsquestionsArray[
            j
          ].fill_field_question = this.fillfieldsquestionsArray[
            j
          ].fill_field_question.replace(
            this.hidewordsOfEachQuestion[j][k],
            '___'
          );
        }
      }
      this.router.navigate(['/fillfieldsqlquestions/0']);
    } else {
      Swal.fire('', 'Δεν υπάρχουν ερωτήσεις σε αυτήν την κατηγορία!', 'info');
    }
  }

  delete() {
    this.textfield = '';
    this.hidewordsOfEachQuestion = [];
    this.categorySelected = true;
    this.header = 'SQL Delete';
    if (this.deletequestionsArray.length != 0) {
      this.fillfieldsquestionsArray = this.deletequestionsArray;
      for (let i = 0; i < this.fillfieldsquestionsArray.length; i++) {
        this.hidewordsOfEachQuestion.push(
          this.fillfieldsquestionsArray[i].hideWord.split(',')
        );
      }
      for (let j = 0; j < this.hidewordsOfEachQuestion.length; j++) {
        for (let k = 0; k < this.hidewordsOfEachQuestion[j].length; k++) {
          this.fillfieldsquestionsArray[
            j
          ].fill_field_question = this.fillfieldsquestionsArray[
            j
          ].fill_field_question.replace(
            this.hidewordsOfEachQuestion[j][k],
            '___'
          );
        }
      }
      this.router.navigate(['/fillfieldsqlquestions/0']);
    } else {
      Swal.fire('', 'Δεν υπάρχουν ερωτήσεις σε αυτήν την κατηγορία!', 'info');
    }
  }

  fun() {
    this.textfield = '';
    this.hidewordsOfEachQuestion = [];
    this.categorySelected = true;
    this.header = 'SQL Functions';
    if (this.funquestionsArray.length != 0) {
      this.fillfieldsquestionsArray = this.funquestionsArray;
      for (let i = 0; i < this.fillfieldsquestionsArray.length; i++) {
        this.hidewordsOfEachQuestion.push(
          this.fillfieldsquestionsArray[i].hideWord.split(',')
        );
      }
      for (let j = 0; j < this.hidewordsOfEachQuestion.length; j++) {
        for (let k = 0; k < this.hidewordsOfEachQuestion[j].length; k++) {
          this.fillfieldsquestionsArray[
            j
          ].fill_field_question = this.fillfieldsquestionsArray[
            j
          ].fill_field_question.replace(
            this.hidewordsOfEachQuestion[j][k],
            '___'
          );
        }
      }
      this.router.navigate(['/fillfieldsqlquestions/0']);
    } else {
      Swal.fire('', 'Δεν υπάρχουν ερωτήσεις σε αυτήν την κατηγορία!', 'info');
    }
  }

  like() {
    this.textfield = '';
    this.hidewordsOfEachQuestion = [];
    this.categorySelected = true;
    this.header = 'SQL Like';
    if (this.likequestionsArray.length != 0) {
      this.fillfieldsquestionsArray = this.likequestionsArray;
      for (let i = 0; i < this.fillfieldsquestionsArray.length; i++) {
        this.hidewordsOfEachQuestion.push(
          this.fillfieldsquestionsArray[i].hideWord.split(',')
        );
      }
      for (let j = 0; j < this.hidewordsOfEachQuestion.length; j++) {
        for (let k = 0; k < this.hidewordsOfEachQuestion[j].length; k++) {
          this.fillfieldsquestionsArray[
            j
          ].fill_field_question = this.fillfieldsquestionsArray[
            j
          ].fill_field_question.replace(
            this.hidewordsOfEachQuestion[j][k],
            '___'
          );
        }
      }
      this.router.navigate(['/fillfieldsqlquestions/0']);
    } else {
      Swal.fire('', 'Δεν υπάρχουν ερωτήσεις σε αυτήν την κατηγορία!', 'info');
    }
  }

  wildcards() {
    this.textfield = '';
    this.hidewordsOfEachQuestion = [];
    this.categorySelected = true;
    this.header = 'SQL WildCards';
    if (this.wildcardsquestionsArray.length != 0) {
      this.fillfieldsquestionsArray = this.wildcardsquestionsArray;
      for (let i = 0; i < this.fillfieldsquestionsArray.length; i++) {
        this.hidewordsOfEachQuestion.push(
          this.fillfieldsquestionsArray[i].hideWord.split(',')
        );
      }
      for (let j = 0; j < this.hidewordsOfEachQuestion.length; j++) {
        for (let k = 0; k < this.hidewordsOfEachQuestion[j].length; k++) {
          this.fillfieldsquestionsArray[
            j
          ].fill_field_question = this.fillfieldsquestionsArray[
            j
          ].fill_field_question.replace(
            this.hidewordsOfEachQuestion[j][k],
            '___'
          );
        }
      }
      this.router.navigate(['/fillfieldsqlquestions/0']);
    } else {
      Swal.fire('', 'Δεν υπάρχουν ερωτήσεις σε αυτήν την κατηγορία!', 'info');
    }
  }

  in() {
    this.textfield = '';
    this.hidewordsOfEachQuestion = [];
    this.categorySelected = true;
    this.header = 'SQL In';
    if (this.inquestionsArray.length != 0) {
      this.fillfieldsquestionsArray = this.inquestionsArray;
      for (let i = 0; i < this.fillfieldsquestionsArray.length; i++) {
        this.hidewordsOfEachQuestion.push(
          this.fillfieldsquestionsArray[i].hideWord.split(',')
        );
      }
      for (let j = 0; j < this.hidewordsOfEachQuestion.length; j++) {
        for (let k = 0; k < this.hidewordsOfEachQuestion[j].length; k++) {
          this.fillfieldsquestionsArray[
            j
          ].fill_field_question = this.fillfieldsquestionsArray[
            j
          ].fill_field_question.replace(
            this.hidewordsOfEachQuestion[j][k],
            '___'
          );
        }
      }
      this.router.navigate(['/fillfieldsqlquestions/0']);
    } else {
      Swal.fire('', 'Δεν υπάρχουν ερωτήσεις σε αυτήν την κατηγορία!', 'info');
    }
  }

  between() {
    this.textfield = '';
    this.hidewordsOfEachQuestion = [];
    this.categorySelected = true;
    this.header = 'SQL Between';
    if (this.betweenquestionsArray.length != 0) {
      this.fillfieldsquestionsArray = this.betweenquestionsArray;
      for (let i = 0; i < this.fillfieldsquestionsArray.length; i++) {
        this.hidewordsOfEachQuestion.push(
          this.fillfieldsquestionsArray[i].hideWord.split(',')
        );
      }
      for (let j = 0; j < this.hidewordsOfEachQuestion.length; j++) {
        for (let k = 0; k < this.hidewordsOfEachQuestion[j].length; k++) {
          this.fillfieldsquestionsArray[
            j
          ].fill_field_question = this.fillfieldsquestionsArray[
            j
          ].fill_field_question.replace(
            this.hidewordsOfEachQuestion[j][k],
            '___'
          );
        }
      }
      this.router.navigate(['/fillfieldsqlquestions/0']);
    } else {
      Swal.fire('', 'Δεν υπάρχουν ερωτήσεις σε αυτήν την κατηγορία!', 'info');
    }
  }

  alias() {
    this.textfield = '';
    this.hidewordsOfEachQuestion = [];
    this.categorySelected = true;
    this.header = 'SQL Alias';
    if (this.aliasquestionsArray.length != 0) {
      this.fillfieldsquestionsArray = this.aliasquestionsArray;
      for (let i = 0; i < this.fillfieldsquestionsArray.length; i++) {
        this.hidewordsOfEachQuestion.push(
          this.fillfieldsquestionsArray[i].hideWord.split(',')
        );
      }
      for (let j = 0; j < this.hidewordsOfEachQuestion.length; j++) {
        for (let k = 0; k < this.hidewordsOfEachQuestion[j].length; k++) {
          this.fillfieldsquestionsArray[
            j
          ].fill_field_question = this.fillfieldsquestionsArray[
            j
          ].fill_field_question.replace(
            this.hidewordsOfEachQuestion[j][k],
            '___'
          );
        }
      }
      this.router.navigate(['/fillfieldsqlquestions/0']);
    } else {
      Swal.fire('', 'Δεν υπάρχουν ερωτήσεις σε αυτήν την κατηγορία!', 'info');
    }
  }

  join() {
    this.textfield = '';
    this.hidewordsOfEachQuestion = [];
    this.categorySelected = true;
    this.header = 'SQL Join';
    if (this.joinquestionsArray.length != 0) {
      this.fillfieldsquestionsArray = this.joinquestionsArray;
      for (let i = 0; i < this.fillfieldsquestionsArray.length; i++) {
        this.hidewordsOfEachQuestion.push(
          this.fillfieldsquestionsArray[i].hideWord.split(',')
        );
      }
      for (let j = 0; j < this.hidewordsOfEachQuestion.length; j++) {
        for (let k = 0; k < this.hidewordsOfEachQuestion[j].length; k++) {
          this.fillfieldsquestionsArray[
            j
          ].fill_field_question = this.fillfieldsquestionsArray[
            j
          ].fill_field_question.replace(
            this.hidewordsOfEachQuestion[j][k],
            '___'
          );
        }
      }
      this.router.navigate(['/fillfieldsqlquestions/0']);
    } else {
      Swal.fire('', 'Δεν υπάρχουν ερωτήσεις σε αυτήν την κατηγορία!', 'info');
    }
  }

  group() {
    this.textfield = '';
    this.hidewordsOfEachQuestion = [];
    this.categorySelected = true;
    this.header = 'SQL Group By';
    if (this.groupbyquestionsArray.length != 0) {
      this.fillfieldsquestionsArray = this.groupbyquestionsArray;
      for (let i = 0; i < this.fillfieldsquestionsArray.length; i++) {
        this.hidewordsOfEachQuestion.push(
          this.fillfieldsquestionsArray[i].hideWord.split(',')
        );
      }
      for (let j = 0; j < this.hidewordsOfEachQuestion.length; j++) {
        for (let k = 0; k < this.hidewordsOfEachQuestion[j].length; k++) {
          this.fillfieldsquestionsArray[
            j
          ].fill_field_question = this.fillfieldsquestionsArray[
            j
          ].fill_field_question.replace(
            this.hidewordsOfEachQuestion[j][k],
            '___'
          );
        }
      }
      this.router.navigate(['/fillfieldsqlquestions/0']);
    } else {
      Swal.fire('', 'Δεν υπάρχουν ερωτήσεις σε αυτήν την κατηγορία!', 'info');
    }
  }

  showAnswer(questionid) {
    const headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: localStorage.getItem('token'),
    };
    this.http
      .get<any>(this.url.baseUrl + '/getonefillfieldquestions/' + questionid, {
        headers,
      })
      .subscribe((data) => {
        if (data.questions) {
          Swal.fire('Answer', data.questions[0].fill_field_question, 'info');
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
