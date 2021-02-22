import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from '../app.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-myscore',
  templateUrl: './myscore.component.html',
  styleUrls: ['./myscore.component.css'],
})
export class MyscoreComponent implements OnInit {
  scoresArray: Array<any>;
  ratesArray: Array<any>;

  constructor(
    private http: HttpClient,
    private url: AppComponent,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    localStorage.setItem('insideFillFieldQuestionsTable', 'no');
    this.spinner.show();
    this.scoresArray = [];
    this.ratesArray=[];
    const headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: localStorage.getItem('token'),
    };
    this.http
      .get<any>(this.url.baseUrl + '/scores/' + localStorage.getItem('id'), {
        headers,
      })
      .subscribe((data) => {
        this.spinner.hide();
        console.log(data.result[0].score_tables);
        if (data.result) {
          for (var i = 0; i < data.result[0].score_tables.length; i++) {
            data.result[0].score_tables[i].createdAt = new Date(
              data.result[0].score_tables[i].createdAt
            ).toString();

            if (data.result[0].score_tables[i].createdAt.includes('Mon'))
              data.result[0].score_tables[
                i
              ].createdAt = data.result[0].score_tables[i].createdAt.replace(
                'Mon',
                'Δευτέρα'
              );
            else if (data.result[0].score_tables[i].createdAt.includes('Tue'))
              data.result[0].score_tables[
                i
              ].createdAt = data.result[0].score_tables[i].createdAt.replace(
                'Tue',
                'Τρίτη'
              );
            else if (data.result[0].score_tables[i].createdAt.includes('Wed'))
              data.result[0].score_tables[
                i
              ].createdAt = data.result[0].score_tables[i].createdAt.replace(
                'Wed',
                'Τετάρτη'
              );
            else if (data.result[0].score_tables[i].createdAt.includes('Thu'))
              data.result[0].score_tables[
                i
              ].createdAt = data.result[0].score_tables[i].createdAt.replace(
                'Thu',
                'Πέμπτη'
              );
            else if (data.result[0].score_tables[i].createdAt.includes('Fri'))
              data.result[0].score_tables[
                i
              ].createdAt = data.result[0].score_tables[i].createdAt.replace(
                'Fri',
                'Παρασκευή'
              );
            else if (data.result[0].score_tables[i].createdAt.includes('Sat'))
              data.result[0].score_tables[
                i
              ].createdAt = data.result[0].score_tables[i].createdAt.replace(
                'Sat',
                'Σάββατο'
              );
            else if (data.result[0].score_tables[i].createdAt.includes('Sun'))
              data.result[0].score_tables[
                i
              ].createdAt = data.result[0].score_tables[i].createdAt.replace(
                'Sun',
                'Κυριακή'
              );

            if (data.result[0].score_tables[i].createdAt.includes('Jan'))
              data.result[0].score_tables[
                i
              ].createdAt = data.result[0].score_tables[i].createdAt.replace(
                'Jan',
                'Ιανουάριος'
              );
            else if (data.result[0].score_tables[i].createdAt.includes('Feb'))
              data.result[0].score_tables[
                i
              ].createdAt = data.result[0].score_tables[i].createdAt.replace(
                'Feb',
                'Φεβρουάριος'
              );
            else if (data.result[0].score_tables[i].createdAt.includes('Mar'))
              data.result[0].score_tables[
                i
              ].createdAt = data.result[0].score_tables[i].createdAt.replace(
                'Mar',
                'Μάρτιος'
              );
            else if (data.result[0].score_tables[i].createdAt.includes('Apr'))
              data.result[0].score_tables[
                i
              ].createdAt = data.result[0].score_tables[i].createdAt.replace(
                'Apr',
                'Απρίλιος'
              );
            else if (data.result[0].score_tables[i].createdAt.includes('May'))
              data.result[0].score_tables[
                i
              ].createdAt = data.result[0].score_tables[i].createdAt.replace(
                'May',
                'Μάιος'
              );
            else if (data.result[0].score_tables[i].createdAt.includes('Jun'))
              data.result[0].score_tables[
                i
              ].createdAt = data.result[0].score_tables[i].createdAt.replace(
                'Jun',
                'Ιούνιος'
              );
            else if (data.result[0].score_tables[i].createdAt.includes('Jul'))
              data.result[0].score_tables[
                i
              ].createdAt = data.result[0].score_tables[i].createdAt.replace(
                'Jul',
                'Ιούλιος'
              );
            else if (data.result[0].score_tables[i].createdAt.includes('Aug'))
              data.result[0].score_tables[
                i
              ].createdAt = data.result[0].score_tables[i].createdAt.replace(
                'Aug',
                'Αύγουστος'
              );
            else if (data.result[0].score_tables[i].createdAt.includes('Sep'))
              data.result[0].score_tables[
                i
              ].createdAt = data.result[0].score_tables[i].createdAt.replace(
                'Sep',
                'Σεπτέμβριος'
              );
            else if (data.result[0].score_tables[i].createdAt.includes('Oct'))
              data.result[0].score_tables[
                i
              ].createdAt = data.result[0].score_tables[i].createdAt.replace(
                'Oct',
                'Οκτώβριος'
              );
            else if (data.result[0].score_tables[i].createdAt.includes('Nov'))
              data.result[0].score_tables[
                i
              ].createdAt = data.result[0].score_tables[i].createdAt.replace(
                'Nov',
                'Νοέμβριος'
              );
            else if (data.result[0].score_tables[i].createdAt.includes('Dec'))
              data.result[0].score_tables[
                i
              ].createdAt = data.result[0].score_tables[i].createdAt.replace(
                'Dec',
                'Δεκέμβριος'
              );
          }
          this.scoresArray = data.result[0].score_tables;
          if (data.result[0].score_tables.length == 0) {
            Swal.fire('Oops...', 'Δεν έχετε καταχωρημένα Σκορ!', 'error');
          }
        } else {
          Swal.fire(
            'Ουπς...',
            'Κάτι πήγε στραβά!Παρακαλώ προσπαθήστε αργότερα.',
            'error'
          );
        }
      });

      this.http
      .get<any>(this.url.baseUrl + '/rates/' + localStorage.getItem('id'), {
        headers,
      })
      .subscribe((data) => {
        this.spinner.hide();
        console.log(data.result[0].success_rates);
        if (data.result) {
          for (var i = 0; i < data.result[0].success_rates.length; i++) {
            data.result[0].success_rates[i].createdAt = new Date(
              data.result[0].success_rates[i].createdAt
            ).toString();

            if (data.result[0].success_rates[i].createdAt.includes('Mon'))
            data.result[0].success_rates[
                i
              ].createdAt =data.result[0].success_rates[i].createdAt.replace(
                'Mon',
                'Δευτέρα'
              );
            else if (data.result[0].success_rates[i].createdAt.includes('Tue'))
            data.result[0].success_rates[
                i
              ].createdAt =data.result[0].success_rates[i].createdAt.replace(
                'Tue',
                'Τρίτη'
              );
            else if (data.result[0].success_rates[i].createdAt.includes('Wed'))
            data.result[0].success_rates[
                i
              ].createdAt = data.result[0].success_rates[i].createdAt.replace(
                'Wed',
                'Τετάρτη'
              );
            else if (data.result[0].success_rates[i].createdAt.includes('Thu'))
            data.result[0].success_rates[
                i
              ].createdAt = data.result[0].success_rates[i].createdAt.replace(
                'Thu',
                'Πέμπτη'
              );
            else if (data.result[0].success_rates[i].createdAt.includes('Fri'))
            data.result[0].success_rates[
                i
              ].createdAt = data.result[0].success_rates[i].createdAt.replace(
                'Fri',
                'Παρασκευή'
              );
            else if (data.result[0].success_rates[i].createdAt.includes('Sat'))
            data.result[0].success_rates[
                i
              ].createdAt = data.result[0].success_rates[i].createdAt.replace(
                'Sat',
                'Σάββατο'
              );
            else if (data.result[0].success_rates[i].createdAt.includes('Sun'))
            data.result[0].success_rates[
                i
              ].createdAt =data.result[0].success_rates[i].createdAt.replace(
                'Sun',
                'Κυριακή'
              );

            if (data.result[0].success_rates[i].createdAt.includes('Jan'))
            data.result[0].success_rates[
                i
              ].createdAt = data.result[0].success_rates[i].createdAt.replace(
                'Jan',
                'Ιανουάριος'
              );
            else if (data.result[0].success_rates[i].createdAt.includes('Feb'))
            data.result[0].success_rates[
                i
              ].createdAt =data.result[0].success_rates[i].createdAt.replace(
                'Feb',
                'Φεβρουάριος'
              );
            else if (data.result[0].success_rates[i].createdAt.includes('Mar'))
            data.result[0].success_rates[
                i
              ].createdAt =data.result[0].success_rates[i].createdAt.replace(
                'Mar',
                'Μάρτιος'
              );
            else if (data.result[0].success_rates[i].createdAt.includes('Apr'))
            data.result[0].success_rates[
                i
              ].createdAt =data.result[0].success_rates[i].createdAt.replace(
                'Apr',
                'Απρίλιος'
              );
            else if (data.result[0].success_ratess[i].createdAt.includes('May'))
            data.result[0].success_rates[
                i
              ].createdAt = data.result[0].success_rates[i].createdAt.replace(
                'May',
                'Μάιος'
              );
            else if (data.result[0].success_rates[i].createdAt.includes('Jun'))
            data.result[0].success_rates[
                i
              ].createdAt = data.result[0].success_rates[i].createdAt.replace(
                'Jun',
                'Ιούνιος'
              );
            else if (data.result[0].success_rates[i].createdAt.includes('Jul'))
            data.result[0].success_rates[
                i
              ].createdAt = data.result[0].success_rates[i].createdAt.replace(
                'Jul',
                'Ιούλιος'
              );
            else if (data.result[0].success_rates[i].createdAt.includes('Aug'))
            data.result[0].success_rates[
                i
              ].createdAt = data.result[0].success_rates[i].createdAt.replace(
                'Aug',
                'Αύγουστος'
              );
            else if (data.result[0].success_rates[i].createdAt.includes('Sep'))
            data.result[0].success_rates[
                i
              ].createdAt = data.result[0].success_rates[i].createdAt.replace(
                'Sep',
                'Σεπτέμβριος'
              );
            else if (data.result[0].success_rates[i].createdAt.includes('Oct'))
            data.result[0].success_rates[
                i
              ].createdAt =data.result[0].success_rates[i].createdAt.replace(
                'Oct',
                'Οκτώβριος'
              );
            else if (data.result[0].success_rates[i].createdAt.includes('Nov'))
            data.result[0].success_rates[
                i
              ].createdAt = data.result[0].success_rates[i].createdAt.replace(
                'Nov',
                'Νοέμβριος'
              );
            else if (data.result[0].success_rates[i].createdAt.includes('Dec'))
            data.result[0].success_rates[
                i
              ].createdAt = data.result[0].success_rates[i].createdAt.replace(
                'Dec',
                'Δεκέμβριος'
              );
          }
          this.ratesArray = data.result[0].success_rates;
          if (data.result[0].success_rates.length == 0) {
            Swal.fire('Oops...', 'Δεν έχετε υλοποιημένα Τεστ!', 'error');
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
