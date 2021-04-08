import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PDFSource } from 'ng2-pdf-viewer';
import { AppComponent } from '../app.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-theory-sql',
  templateUrl: './theory-sql.component.html',
  styleUrls: ['./theory-sql.component.css'],
})
export class TheorySqlComponent implements OnInit {
  pdfSrc: string | PDFSource | ArrayBuffer = '';
  pdfArray = [];
  role = '';
  clickpdf = false;
  fileToUpload: File = null;
  titlepdf = '';
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
    this.pdfSrc = '';
    this.pdfArray = [];
    this.spinner.show();
    this.role = localStorage.getItem('role');
    this.getFiles();
  }
  getFiles() {
    const headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: localStorage.getItem('token'),
    };
    this.http
      .get<any>(this.url.baseUrl + '/allfiles', { headers })
      .subscribe((data) => {
        console.log(data);
        this.spinner.hide();
        if (data.files == 'No Pdf yet') {
          Swal.fire('', 'Δεν υπάρχουν διαθέσιμα PDF για ανάγνωση!', 'info');
        } else {
          this.pdfArray = data.files;
        }
      });
  }
  deletePdf(pdf) {
    Swal.fire({
      title: 'Είστε σίγουρος?',
      text: 'Δεν μπορείτε να το επαναφέρετε!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ναι, διαγραφή!',
      cancelButtonText: 'Ακύρωση',
    }).then((result) => {
      if (result.isConfirmed) {
        const headers = {
          'Content-Type': 'application/json; charset=UTF-8',
          Authorization: localStorage.getItem('token'),
        };
        this.http
          .get<any>(this.url.baseUrl + '/deletefile/' + pdf, { headers })
          .subscribe((data) => {
            if (data.result) {
              this.pdfSrc = '';
              this.pdfArray = [];
              this.ngOnInit();
              Swal.fire('', 'Το PDF διαγράφτηκε επιτυχώς', 'success');
            } else {
              Swal.fire('', data, 'error');
            }
          });
      }
    });
  }
  readPdf(pdf) {
    this.spinner.show();
    this.titlepdf = pdf;
    const headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: localStorage.getItem('token'),
    };
    this.clickpdf = true;
    this.http
      .get<any>(this.url.baseUrl + '/readfile/' + pdf, { headers })
      .subscribe((data) => {
        this.spinner.hide();
        this.pdfSrc = data.files;
      });
  }
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }
  upload(fileToUpload) {
    if(fileToUpload){
    let testData: FormData = new FormData();
    testData.append('file_upload', fileToUpload, fileToUpload.name);
    this.http
      .post<any>(this.url.baseUrl + 'upload', testData)
      .subscribe((response) => {
        if (response.result == 'File Uploaded') {
          Swal.fire(
            '',
            'Το PDF κοινοποιήθηκε επιτυχώς!',
            'success'
          );
          this.pdfSrc = '';
          this.pdfArray = [];
          this.ngOnInit();
        } else {
          console.log(response);
          Swal.fire('', response.error, 'error');
        }
      });
    }else{
      Swal.fire('', 'Δεν έχει επιλεχθεί κάποιο pdf για κοινοποίηση...', 'error');
    }
  }
  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }
  info(){
    Swal.fire(
      '',
      'Στην "Θεωρία SQL" μπορείτε να αναρτήσετε τα δικά σας pdf έτσι ώστε να γίνουν ορατά στους Εκπαιδευόμενους...',
      'info'
    );
  }
}
